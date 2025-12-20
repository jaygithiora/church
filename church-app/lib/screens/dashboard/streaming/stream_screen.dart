import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_projects/api/livekit_api_service.dart';
import 'package:livekit_client/livekit_client.dart';

class StreamScreen extends StatefulWidget {
  final bool isDarkMode;
  const StreamScreen({Key? key, required this.isDarkMode}) : super(key: key);

  @override
  _StreamScreenState createState() => _StreamScreenState();
}

class _StreamScreenState extends State<StreamScreen> {
  final LivekitApiService _api = LivekitApiService();
  Room? _room;
  EventsListener<RoomEvent>? _roomListener;
  bool _isLoading = false;
  String? _error;
  String _url = '';
  String _token = '';
  bool _isPublishing = false;
  bool _isMicOn = true;
  bool _isCameraOn = true;

  @override
  void initState() {
    super.initState();
    _startConnectFlow();
  }

  @override
  void dispose() {
    _roomListener?.dispose();
    _room?.removeListener(_onRoomChanged);
    _room?.dispose();
    super.dispose();
  }

  Future<void> _startConnectFlow() async {
    setState(() => _isLoading = true);
    try {
      final resp = await _api.getToken();
      if (resp.isEmpty || resp['response'] == null) {
        _error = resp['message'] ?? 'Failed to get token';
        setState(() => _isLoading = false);
        return;
      }
      _url = resp['response']['url'];
      _token = resp['response']['token'];
      await _connectRoom();
      setState(() {
        _isLoading = false;
      });
    } catch (e) {
      _error = 'Error: $e';
      setState(() => _isLoading = false);
    }
  }

  void _onRoomChanged() {
    if (mounted) setState(() {});
  }

  void _setupRoomListeners(Room room) {
    room.addListener(_onRoomChanged);
    _roomListener = room.createListener()
      ..on<ParticipantConnectedEvent>((e) {
        debugPrint('Participant connected: ${e.participant.identity}');
        setState(() {});
      })
      ..on<ParticipantDisconnectedEvent>((e) {
        debugPrint('Participant disconnected: ${e.participant.identity}');
        setState(() {});
      })
      ..on<TrackSubscribedEvent>((e) {
        debugPrint('Track subscribed: ${e.publication.track}');
        setState(() {});
      })
      ..on<TrackUnsubscribedEvent>((e) {
        debugPrint('Track unsubscribed: ${e.publication.track}');
        setState(() {});
      })
      ..on<LocalTrackPublishedEvent>((e) {
        debugPrint('Local track published: ${e.publication.track}');
        setState(() {});
      })
      ..on<RoomDisconnectedEvent>((e) {
        debugPrint('Room disconnected');
        setState(() {});
      });
  }

  Future<void> _connectRoom() async {
    final room = Room();
    _setupRoomListeners(room);

    await room.connect(
      _url,
      _token,
      connectOptions: const ConnectOptions(autoSubscribe: true),
    );

    // enable camera + mic
    await room.localParticipant?.setCameraEnabled(true);
    await room.localParticipant?.setMicrophoneEnabled(true);

    _room = room;
    setState(() {});
  }

  VideoTrack? _firstVideoTrack(Iterable<TrackPublication> pubs) {
    return pubs.map((p) => p.track).whereType<VideoTrack>().firstOrNull;
  }

  Widget _buildLocalVideoView() {
    final pubs = _room?.localParticipant?.videoTrackPublications ?? [];
    final track = _firstVideoTrack(pubs);
    if (track == null) {
      return const Center(child: Text('Waiting for camera…'));
    }
    return Container(color: Colors.black, child: VideoTrackRenderer(track));
  }

  Widget _buildRemoteGridView() {
    if (_room == null || _room!.remoteParticipants.isEmpty) {
      return const Center(child: Text('No viewers yet'));
    }
    final children = _room!.remoteParticipants.values.map((p) {
      final track = _firstVideoTrack(p.videoTrackPublications);
      /*if (track != null) {
        return Container(
          color: Colors.transparent,
          child: VideoTrackRenderer(track),
        );
      } else {
        return Container(
          color: Colors.transparent,
          child: Center(child: Text(p.identity)),
        );
      }
    }).toList();*/
      return Container(
        width: 120,
        height: 160,
        margin: const EdgeInsets.symmetric(horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(10),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: track != null
              ? VideoTrackRenderer(track)
              : Center(
                  child: Text(
                    p.identity,
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
        ),
      );
    }).toList();
    return SizedBox(
      height: 160,
      child: ListView(
        scrollDirection: Axis.horizontal,
        reverse: true,
        padding: const EdgeInsets.all(8),
        children: children,
      ),
    );
    /*return GridView.count(
      crossAxisCount: children.length == 1 ? 1 : 2,
      children: children,
    );*/
  }

  void _toggleMic() async {
    if (_room?.localParticipant != null) {
      final enabled = !_isMicOn;
      await _room!.localParticipant!.setMicrophoneEnabled(enabled);
      setState(() => _isMicOn = enabled);
    }
  }

  void _toggleCamera() async {
    if (_room?.localParticipant != null) {
      final enabled = !_isCameraOn;
      await _room!.localParticipant!.setCameraEnabled(enabled);
      setState(() => _isCameraOn = enabled);
    }
  }

  void _endStream() async {
    await _room?.disconnect();
    _room = null;
    if (mounted) setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    if (_error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(_error!),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _startConnectFlow,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }
    if (_room == null) {
      return const Scaffold(body: Center(child: Text('Initializing…')));
    }

    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        title: const Text('Vidcast Live Stream'),
        /*actions: [
          IconButton(
            icon: Icon(_isMicOn ? Icons.mic : Icons.mic_off),
            onPressed: _toggleMic,
          ),
          IconButton(
            icon: Icon(_isCameraOn ? Icons.videocam : Icons.videocam_off),
            onPressed: _toggleCamera,
          ),
          IconButton(
            icon: const Icon(Icons.call_end),
            onPressed: _endStream,
            color: Colors.red,
          ),
        ],*/
      ),
      body: Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).padding.bottom, // ⬅ prevents overlap
        ),
        child: Stack(
          children: [
            Positioned.fill(child: _buildLocalVideoView()),
            Positioned(
              left: 0,
              right: 0,
              bottom: 100,
              child: _buildRemoteGridView(),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 10,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 20,
                    vertical: 12,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(40),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        iconSize: 28,
                        icon: Icon(
                          _isMicOn ? Icons.mic : Icons.mic_off,
                          color: Colors.white,
                        ),
                        onPressed: _toggleMic,
                      ),
                      const SizedBox(width: 16),
                      IconButton(
                        iconSize: 28,
                        icon: Icon(
                          _isCameraOn ? Icons.videocam : Icons.videocam_off,
                          color: Colors.white,
                        ),
                        onPressed: _toggleCamera,
                      ),
                      const SizedBox(width: 16),
                      Container(
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          iconSize: 28,
                          icon: const Icon(Icons.call_end, color: Colors.white),
                          onPressed: _endStream,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

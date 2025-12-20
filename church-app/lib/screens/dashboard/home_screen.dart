import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _scrollController = ScrollController();
  final FocusNode _searchFocus = FocusNode();

  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay; // = DateTime.now();
  String? status;

  int _currentPage = 1;
  int _lastPage = 1;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();


    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 200 &&
          !_isLoading &&
          _currentPage < _lastPage) {
      }
    });
  }

  @override
  void dispose() {
    _searchFocus.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            titleSpacing:0,
          leading: Padding(
            padding: const EdgeInsets.all(15.0),
            child: Badge(
    backgroundColor:Colors.transparent,
    label: Icon(Icons.circle, color: Colors.indigo,size: 9,),
    isLabelVisible: true,
    child:Image.asset("assets/logos/webcast.png"),),
          ),
          title: Column(crossAxisAlignment: CrossAxisAlignment.start,children: [Text("Vidcast", style: TextStyle(fontWeight: FontWeight.bold),), Text(DateFormat("dd MMMM, yyyy - EEEE")
              .format(DateTime.now()), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w500),)],),
          actions: [
            IconButton(onPressed: (){}, icon: Badge(
        backgroundColor:Colors.transparent,
        label: Icon(Icons.circle, color: Colors.red,size: 9,),
        isLabelVisible: true,
        child:Icon(Icons.notifications)))
          ],
        ),
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.only(
              bottom:
              MediaQuery.of(context).padding.bottom, // ⬅ prevents overlap
            ),
            child: ListView(
                //padding: const EdgeInsets.all(16),
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom:
                    10.0),
                    child: TextField(
                      focusNode: _searchFocus,
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.symmetric(vertical: 0),
                        isDense: false,
                        hintText: "Looking for something?",
                        prefixIcon: const Icon(Icons.search),
                        filled: true,
                        fillColor: Colors.grey[200],
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide.none,
                        ),
                        suffixIcon: Padding(
                          padding: const EdgeInsets.all(1.0),
                          child: InkWell(
                              onTap: () {
                                //showFilterSheet(context);
                              },
                              child: Padding(
                                padding: const EdgeInsets.all(6.0),
                                child: const Icon(Icons.tune),
                              // ✅ You can use Icon(Icons.search)
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(children: [
                      Icon(Icons.flash_on, size: 10,),
                      Expanded(child: Padding(padding:EdgeInsets.all(8.0), child: Text("Trending Broadcasts", style: TextStyle(fontWeight: FontWeight.bold),))),
                      InkWell(child: Text("See All", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo),))],),
                  ),
                  // FIRST HORIZONTAL LIST
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.25,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 10,
                itemBuilder: (context, index) {
                  return AspectRatio(
                          aspectRatio: 11 / 16,
                          child: Container(
                            margin: EdgeInsets.only(left: 12),
                            decoration: BoxDecoration(
                                border: Border.all(width: 3, color: Colors.indigo),
                                color: Colors.transparent,
                                borderRadius: BorderRadius.circular(15)
                            ),
                            child: Container(
                              margin: EdgeInsets.all(5.0),
                              decoration: BoxDecoration(
                                image: DecorationImage(
                                  image: AssetImage("assets/images/sample.jpg"),
                                  fit: BoxFit.cover,
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Container(padding: EdgeInsets.all(10.0),decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Colors.black.withOpacity(0.3), // faint black
                                  ],
                                ),
                              ),child: Column(mainAxisAlignment:MainAxisAlignment.end, children:[
                                Row(crossAxisAlignment: CrossAxisAlignment.center,children: [CircleAvatar(backgroundImage: AssetImage("assets/images/sample.jpg"),radius: 10,),SizedBox(width: 3.0,),
                                  Flexible(child: Text("James Githiora", style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),overflow: TextOverflow.ellipsis,maxLines: 1,),),
                                SizedBox(width: 1.0,),Icon(Icons.verified, color: Colors.white,size:10,)],)] ,)),
                            ),
                          ),


                  );
                },
              ),
            ),

            SizedBox(height: 16),
          SizedBox(
            height: 50,
            child: DefaultTabController(
              length: 3,
              child: TabBar(
                dividerColor: Colors.transparent, // removes the bottom border line
                tabs: [
                  Tab(text: 'Following'),
                  Tab(text: 'Near You'),
                  Tab(text: 'Interests'),
                ],
              ),
            ),
          ),
                  SizedBox(height: 8),

          // THIRD VERTICAL LIST (SHARES SAME SCROLL)
                  ListView.builder(
                    padding: EdgeInsets.all(10.0),
                    controller: _scrollController,
                    physics: NeverScrollableScrollPhysics(),  // important!
                    shrinkWrap: true,                       // important!
                    itemCount: 10,//_appointments.length + 1,
                    itemBuilder: (context, index) {
                      return Container(
                          margin: EdgeInsets.only(bottom: 12),
                          decoration: BoxDecoration(
                            color: Colors.white70,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Column(
                            children: [
                              ListTile(leading: CircleAvatar(backgroundImage: AssetImage("assets/images/sample.jpg"),), title: Text("James Githiora"),subtitle: Text("This is a sample text"),
                                trailing: FittedBox(
                                  child: TextButton(onPressed: (){}, child: Row(
                                  children: [
                                    Icon(Icons.add),
                                    Text("Follow"),
                                  ],
                                                            )),
                                ),),ClipRRect(
                                borderRadius: BorderRadius.circular(12), // adjust radius
                                child: Image.asset(
                                  "assets/images/sample.jpg",
                                  fit: BoxFit.cover,
                                ),
                              )

                            ],
                          ),

                      );
                      /*if (index == _appointments.length) {
                        return _isLoading
                            ? Padding(
                          padding: EdgeInsets.all(16),
                          child: Center(child: CircularProgressIndicator()),
                        )
                            : SizedBox.shrink();
                      }

                      final appointment = _appointments[index];

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 10.0),
                        child: ListTile(
                          leading: CircleAvatar(
                            backgroundImage: appointment.practitioner?.user.image != null
                                ? NetworkImage("${appointment.practitioner?.user.image}")
                                : AssetImage("assets/images/avatar.png")
                            as ImageProvider,
                          ),
                          title: Text(appointment.practitioner?.name ?? "Not Assigned"),
                          subtitle: Text(DateFormat("dd MMM, yyyy")
                              .format(DateTime.parse(appointment.fromDate))),
                        ),
                      );*/
                    },
                  ),
                ],
              ),

          ),
          
        ), floatingActionButton: FloatingActionButton(onPressed: (){
          Navigator.pushNamed(context, "/stream");
    },
      shape: CircleBorder(),
      elevation: 6,
      backgroundColor: Colors.indigo
      ,foregroundColor: Colors.white,
      child: Icon(Icons.video_call),
    ),);
  }
/*
  void showFilterSheet(BuildContext context) {
    DateTime fDay = _focusedDay; // copy current state
    DateTime? sDay = _selectedDay;
    String? status = this.status;
    bool isLoading = _isLoading;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      useSafeArea: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
            top: Radius.circular(20)), // rounded top corners
      ),
      builder: (context) {
        return StatefulBuilder(builder: (context, setModalState) {
          return FractionallySizedBox(
            heightFactor:
            0.9, // 👈 90% of screen height, feels like full-screen but user still sees page
            child: Column(
              children: [
                // --- Header with close button ---
                Padding(
                  padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Filters",
                        style: TextStyle(
                            fontSize: 20, fontWeight: FontWeight.bold),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close),
                        onPressed:
                        isLoading ? null : () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),

                const Divider(height: 1),

                // --- Filter Fields ---
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      AbsorbPointer(
                        absorbing: _isLoading,
                        child: TableCalendar(
                            key: ValueKey(sDay),
                            focusedDay: fDay,
                            firstDay: DateTime.now()
                                .subtract(const Duration(days: 3650)),
                            lastDay:
                            DateTime.now().add(const Duration(days: 365)),
                            calendarFormat: CalendarFormat.week,
                            //headerVisible: false,
                            headerStyle: const HeaderStyle(
                                formatButtonVisible: false,
                                titleCentered: true,
                                leftChevronIcon: Icon(
                                  Icons.arrow_back_ios,
                                  color: Color(0xFF6D2FFD),
                                ),
                                rightChevronIcon: Icon(
                                  Icons.arrow_forward_ios,
                                  color: Color(0xFF6D2FFD),
                                )),
                            calendarStyle: const CalendarStyle(
                              todayDecoration: BoxDecoration(
                                  color: Color.fromARGB(255, 198, 182, 235),
                                  shape: BoxShape.circle),
                              selectedDecoration: BoxDecoration(
                                  color: Color(0xFF6D2FFD),
                                  shape: BoxShape.circle),
                              selectedTextStyle: TextStyle(color: Colors.white),
                            ),
                            selectedDayPredicate: (day) => isSameDay(sDay, day),
                            onDaySelected: (selectedDay, focusedDay) async {
                              if (!isSameDay(sDay, selectedDay)) {
                                setModalState(() {
                                  sDay = selectedDay;
                                  fDay = focusedDay;
                                });
                              }
                            }),
                      ),
                      const Divider(),

                      // Example: Status Filter
                      Text("Status",
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      Wrap(
                        spacing: 8,
                        children: [
                          FilterChip(
                              label: const Text("Active"),
                              selected: status == "Active",
                              onSelected: (_) {
                                setModalState(() => status = "Active");
                              }),
                          FilterChip(
                              label: const Text("Pending"),
                              selected: status == "Pending",
                              onSelected: (_) {
                                setModalState(() => status = "Pending");
                              }),
                          FilterChip(
                              label: const Text("Cancelled"),
                              selected: status == "Cancelled",
                              onSelected: (_) {
                                setModalState(() => status = "Cancelled");
                              }),
                          FilterChip(
                              label: const Text("Rejected"),
                              selected: status == "Rejected",
                              onSelected: (_) {
                                setModalState(() => status = "Rejected");
                              }),
                          FilterChip(
                              label: const Text("Missed"),
                              selected: status == "Missed",
                              onSelected: (_) {
                                setModalState(() => status = "Missed");
                              }),
                          FilterChip(
                              label: const Text("Completed"),
                              selected: status == "Completed",
                              onSelected: (_) {
                                setModalState(() => status = "Completed");
                              }),
                        ],
                      ),
                    ],
                  ),
                ),

                // --- Apply Button ---
                Padding(
                  padding: EdgeInsets.only(left: 16, right: 16, top: 8),
                  child: SizedBox(
                    width: double.infinity,
                    child: TextButton(
                      onPressed: isLoading
                          ? null
                          : () async {
                        setModalState(() {
                          _focusedDay = fDay;
                          _selectedDay = sDay;
                          status = status;
                          _currentPage = 1;
                          isLoading = true;
                        });
                        _appointments.clear();
                        await _fetchAppointments();
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: isLoading
                          ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 1, color: Colors.white),
                      )
                          : const Text("Apply Filters"),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(
                      bottom: MediaQuery.of(context)
                          .padding
                          .bottom, // ⬅ prevents overlap
                      left: 16,
                      right: 16,
                      top: 8),
                  child: SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isLoading
                          ? null
                          : () async {
                        setModalState(() {
                          _focusedDay = fDay;
                          _selectedDay = null;
                          status = "";
                          _appointments.clear();
                          _currentPage = 1;
                          isLoading = true;
                        });

                        await _fetchAppointments();
                        // apply filters
                        Navigator.pop(context);
                      },
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: isLoading
                          ? SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 1, color: Colors.white),
                      )
                          : Text("Clear Filters"),
                    ),
                  ),
                ),
              ],
            ),
          );
        });
      },
    );
  }*/
}
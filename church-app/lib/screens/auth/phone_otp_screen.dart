import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_custom_clippers/flutter_custom_clippers.dart';
import 'package:flutter_projects/api/api_auth_service.dart';
import 'package:flutter_projects/credentials.dart';
import 'package:flutter_projects/widgets/my_input_decorations_widget.dart';
import 'package:intl_phone_number_input/intl_phone_number_input.dart';

class PhoneOtpScreen extends StatefulWidget {
  final bool isDarkMode;
  const PhoneOtpScreen({super.key, required this.isDarkMode});

  @override
  State<PhoneOtpScreen> createState() => _PhoneOtpScreenState();
}
//636742

class _PhoneOtpScreenState extends State<PhoneOtpScreen> {
  final ApiAuthService _apiAuthService = ApiAuthService();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  final List<TextEditingController> _controllers = List.generate(
    6,
    (_) => TextEditingController(),
  );
  String phone = "";
  bool isLoading = false;
  String errors = "";
  int _secondsRemaining = 60;
  Timer? _timer;
  String otp = "";

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    _focusNodes[0].requestFocus();
    _startTimer();
  }

  @override
  void dispose() {
    for (var node in _focusNodes) {
      node.dispose();
    }
    for (var controller in _controllers) {
      controller.dispose();
    }
    _timer?.cancel();
    super.dispose();
  }

  void _onChanged(String value, int index) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    }
    if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
  }

  void getOtp() {
    otp = "";
    for (var controller in _controllers) {
      otp += controller.text;
    }
  }

  Future<bool> resendOtp() async {
    setState(() {
      isLoading = true;
    });
    final response = await _apiAuthService.generatePhoneVerificationCode();
    debugPrint("OTP Response: $response");
    if (response.isNotEmpty) {
      if (response['user'] == null) {
        errors = response['message'] ?? "Registering failed! Please try again";
        setState(() {
          isLoading = false;
        });
        return false;
      } else {
        _startTimer();
        setState(() {
          isLoading = false;
        });
        return true;
      }
    }
    /*
    bool isConnected = await IsConnected().isConnected();
    if (isConnected) {
      errors = '';
      try {
        SharedPreferences localStorage = await SharedPreferences.getInstance();
        String? firebaseToken = localStorage.getString("firebase_token");
        var response =
            await post(Uri.parse('${url}login'), headers: <String, String>{
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        }, body: {
          'email': _emailController.text,
          'password': _passwordController.text,
          'firebaseToken': "$firebaseToken"
        });
        //print("FireBase Token: $firebaseToken");
        //print("response: ${response.body}");
        if (response.statusCode == 200) {
          final responseJson = json.decode(response.body);
          Map map = responseJson;
          if (map.isNotEmpty) {
            localStorage.setString('token', map['access_token']);
            //print("my token! ${map['access_token']}");
            localStorage.setString('name',
                "${map['user']['firstname']} ${map['user']['lastname']}");
            localStorage.setString('email', "${map['user']['email']}");
            localStorage.setString('phone', map['user']['phone']);
            localStorage.setString('image', map['user']['image'] ?? "");

            Credentials().setName(
                "${map['user']['firstname']} ${map['user']['lastname']}");
            Credentials().setPhone("${map['user']['phone']}");
            Credentials().setEmail("${map['user']['email']}");
            Credentials().setImage(map['user']['image'] ?? "");

            //roles
            List roleResp = map["user"]["roles"];
            List<Role> roles =
                roleResp.map((role) => Role.fromJson(role)).toList();
            for (Role role in roles) {
              Credentials().setRole(role.name);
              //localStorage.setString("role", role.name);
            }

            List<String> permResp = List<String>.from(map["permissions"]);
            /*List<Permission> permissions =
                permResp.map((perm) => Permission.fromJson(perm)).toList();*/

            Credentials().setPermission(permResp);
            /*List<String> perms = [];
            for (Permission permission in permissions) {
              perms.add(permission.name);
            }
            localStorage.setStringList("permissions", perms);*/

            if (map['user']['phone_verified_at'] != null) {
              Credentials().setIsOTPVerified(true);
            }
            if (map['user']['email_verified_at'] != null) {
              Credentials().setIsEmailVerified(true);
            }

            loggedin = true;
            return true;
          } else {
            errors = "Logging in failed! Please try again";
          }
        } else {
          final responseJson = json.decode(response.body);
          Map map = responseJson;
          errors = (map["errors"] ?? map["error"]).toString();
          // ignore: use_build_context_synchronously
          showSnackBar(
              context: context,
              message: "Whoops! $errors!",
              icon: Icons.warning);
        }
      } catch (e) {
        //errors = "Something went wrong!";
        //print("Something went wrong! $e");
        showSnackBar(
            // ignore: use_build_context_synchronously
            context: context,
            message: "Whoops! $e!",
            icon: Icons.warning);
      }
    } else {
      showSnackBar(
          // ignore: use_build_context_synchronously
          context: context,
          message: "Whoops! You're not connected to the INTERNET!",
          icon: Icons.wifi_off);
    }
*/
    setState(() {
      isLoading = false;
    });
    return false;
  }

  Future<bool> validateOtp() async {
    setState(() {
      isLoading = true;
    });
    final response = await _apiAuthService.validatePhoneVerificationCode(
      otp: otp,
    );
    debugPrint("OTP Response: $response");
    if (response.isNotEmpty) {
      if (response['success'] == null) {
        errors =
            response['message'] ?? "Validating otp failed! Please try again";
        setState(() {
          isLoading = false;
        });
        return false;
      } else {
        Credentials.isOTPVerified = true;
        setState(() {
          isLoading = false;
        });
        return true;
      }
    }
    setState(() {
      isLoading = false;
    });
    return false;
  }

  void _startTimer() {
    _secondsRemaining = 60;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining == 0) {
        timer.cancel();
      } else {
        setState(() {
          _secondsRemaining--;
        });
      }
    });
  }

  String maskPhoneNumber(String phone) {
    // Example: +254712345678 → +2547******78
    phone = Credentials().getPhone();
    if (phone.length < 4) return phone;
    int visibleStart = 5; // keep "+2547"
    int visibleEnd = 2; // keep last 2 digits
    String start = phone.substring(0, visibleStart);
    String end = phone.substring(phone.length - visibleEnd);
    String masked = '*' * (phone.length - visibleStart - visibleEnd);
    return '$start$masked$end';
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: widget.isDarkMode
            ? Brightness.light
            : Brightness.light,
        statusBarIconBrightness: widget.isDarkMode
            ? Brightness.light
            : Brightness.light,
      ),
      child: Scaffold(
        resizeToAvoidBottomInset: true,
        body: Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topRight,
                  end: Alignment.bottomLeft,
                  colors: [const Color(0xff000428), const Color(0xff004e92)],
                ),
              ),
            ),
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 60.0),
                  child: Text(
                    "Vidcast",
                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Expanded(
                  child: Stack(
                    children: [
                      Container(
                        margin: EdgeInsets.only(top: 20, right: 20, left: 20),
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.white54,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(30),
                            topRight: Radius.circular(30),
                          ),
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 40),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.only(
                            topLeft: Radius.circular(30),
                            topRight: Radius.circular(30),
                          ),
                        ),
                        child: Center(
                          child: ListView(
                            shrinkWrap: true,
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(
                                  vertical: 20.0,
                                  horizontal: 30.0,
                                ),
                                child: Form(
                                  key: _formKey,
                                  autovalidateMode:
                                      AutovalidateMode.onUserInteraction,
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SizedBox(height: 30),
                                      Padding(
                                        padding: EdgeInsets.symmetric(
                                          vertical: 10,
                                        ),
                                        child: Center(
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              Image.asset(
                                                "assets/logos/webcast.png",
                                                height: 40,
                                              ),
                                              SizedBox(width: 10),
                                              Flexible(
                                                child: Text(
                                                  "Phone Verification Code",
                                                  style: TextStyle(
                                                    color: Color(0xff041f41),
                                                    fontSize: 20,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Flexible(
                                            child: Text(
                                              "We've Sent a 6-digit code to ${maskPhoneNumber(phone)}",
                                              style: TextStyle(
                                                color: Color(0xff041f41),
                                                /*fontSize: 20,
                                                fontWeight:
                                                FontWeight.w600,*/
                                              ),
                                              //overflow: TextOverflow.ellipsis
                                              textAlign: TextAlign.center,
                                            ),
                                          ),
                                        ],
                                      ),

                                      Padding(
                                        padding: const EdgeInsets.all(10),
                                        child: SizedBox(
                                          height: 60,
                                          child: Center(
                                            child: ListView(
                                              scrollDirection: Axis.horizontal,
                                              children: List.generate(6, (index) {
                                                return SizedBox(
                                                  width: 50,
                                                  child: TextField(
                                                    controller: _controllers[index],
                                                    focusNode: _focusNodes[index],
                                                    maxLength: 1,
                                                    keyboardType:
                                                        TextInputType.number,
                                                    textAlign: TextAlign.center,
                                                    //style: const TextStyle(fontSize: 24),
                                                    decoration:
                                                        MyInputDecorations.textFieldDecoration(
                                                          label: "",
                                                        ),
                                                    onChanged: (value) =>
                                                        _onChanged(value, index),
                                                  ),
                                                );
                                              }),
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 20),
                                      Padding(
                                        padding: EdgeInsets.all(10),
                                        child: Center(
                                          child: RichText(
                                            text: TextSpan(
                                              text: "Didn't receive an SMS? ",
                                              style: Theme.of(context)
                                                  .textTheme
                                                  .bodyMedium
                                                  ?.copyWith(fontSize: 14),
                                              children: [
                                                _secondsRemaining > 0
                                                    ? TextSpan(
                                                        text:
                                                            "Resend (${_secondsRemaining}s)",
                                                        style: const TextStyle(
                                                          color: Colors.grey,
                                                        ), // disabled
                                                      )
                                                    : TextSpan(
                                                        text: "Resend",
                                                        style: const TextStyle(
                                                          color: Colors
                                                              .brown, // make it look like a link
                                                          decoration:
                                                              TextDecoration
                                                                  .underline,
                                                        ),
                                                        recognizer:
                                                            TapGestureRecognizer()
                                                              ..onTap =
                                                                  isLoading
                                                                  ? null
                                                                  : () async {
                                                                      await resendOtp();
                                                                    },
                                                      ),
                                              ],
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ),
                                      ),

                                      Container(
                                        height: 55,
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            begin: Alignment.topRight,
                                            end: Alignment.bottomLeft,
                                            colors: [
                                              const Color(0xff004e92),
                                              const Color(0xff000428),
                                            ],
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            10,
                                          ),
                                          border: Border.all(
                                            color: Color(0xff2497f3),
                                            width: 0,
                                          ),
                                        ),
                                        child: TextButton(
                                          style: TextButton.styleFrom(
                                            backgroundColor: Colors.transparent,
                                          ),
                                          onPressed: () async {
                                            getOtp();
                                            if (otp.length < 6) {
                                              ScaffoldMessenger.of(
                                                context,
                                              ).showSnackBar(
                                                SnackBar(
                                                  content: Text(
                                                    "Please enter the 6-digit OTP",
                                                  ),
                                                ),
                                              );

                                              return;
                                            } else {
                                              bool isOk = await validateOtp();
                                              if (isOk) {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  SnackBar(
                                                    backgroundColor:
                                                        Colors.indigo,
                                                    content: Text(
                                                      'Success: Otp validated successfully',
                                                    ),
                                                  ),
                                                );
                                                Navigator.pushNamedAndRemoveUntil(
                                                  context,
                                                  "/home",
                                                  (route) =>
                                                      false, // ModalRoute.withName('/welcome'),
                                                );
                                              } else {
                                                ScaffoldMessenger.of(
                                                  context,
                                                ).showSnackBar(
                                                  SnackBar(
                                                    content: Text(
                                                      'Error: $errors',
                                                    ),
                                                  ),
                                                );
                                              }
                                            }
                                          },
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              isLoading
                                                  ? const SizedBox(
                                                      height: 20,
                                                      width: 20,
                                                      child:
                                                          CircularProgressIndicator(
                                                            strokeWidth: 2,
                                                            color: Colors.white,
                                                          ),
                                                    )
                                                  : const Icon(
                                                      Icons.send,
                                                      color: Colors.white,
                                                    ),
                                              const SizedBox(width: 10),
                                              Text(
                                                isLoading
                                                    ? 'Validating...'
                                                    : 'VALIDATE',
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 10),
                                      Padding(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 30.0,
                                        ),
                                        child: InkWell(
                                          onTap: () async {
                                            Navigator.pushNamed(
                                              context,
                                              "/login",
                                            );
                                          },
                                          child: Padding(
                                            padding: EdgeInsets.symmetric(
                                              vertical: 15.0,
                                            ),
                                            child: Row(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                Flexible(
                                                  child: Text(
                                                    "Already have an account? Login",
                                                    style: TextStyle(
                                                      color: Color(0xff2497f3),
                                                      fontWeight:
                                                          FontWeight.bold,
                                                    ),
                                                    textAlign: TextAlign.center,
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
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

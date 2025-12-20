import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:flutter_custom_clippers/flutter_custom_clippers.dart';
import 'package:flutter_projects/api/api_auth_service.dart';
import 'package:flutter_projects/credentials.dart';

class LoginScreen extends StatefulWidget {
  final bool isDarkMode;
  const LoginScreen({super.key, required this.isDarkMode});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final ApiAuthService _apiAuthService = ApiAuthService();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool hidePassword = true;
  bool isLoading = false;
  String? errors;
  bool loggedin = false;

  Future<bool> login() async {
    setState(() {
      isLoading = true;
    });
    final response = await _apiAuthService.login(
      email: _emailController.text,
      password: _passwordController.text,
    );
    //debugPrint("Login Response: $response");
    if (response.isNotEmpty) {
      if (response['user'] == null) {
        errors = response['message'] ?? "Login failed! Please try again";
        setState(() {
          isLoading = false;
        });
        return false;
      } else {
        setState(() {
          isLoading = false;
        });
        loggedin = true;
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
                              Container(
                                decoration: BoxDecoration(
                                  /*gradient: LinearGradient(
                                begin: Alignment.topRight,
                                end: Alignment.bottomLeft,
                                colors: [
                                  const Color(0x00000000),
                                  const Color(0x00000000),
                                ],
                              ),*/
                                  color: widget.isDarkMode
                                      ? Colors.black
                                      : Colors.white,
                                ),
                                child: Padding(
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
                                                    "Welcome Back",
                                                    style: TextStyle(
                                                      color: Color(0xff041f41),
                                                      fontSize: 20,
                                                      fontWeight:
                                                          FontWeight.w600,
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
                                                "Enter your details below",
                                                style: TextStyle(
                                                  color: Color(0xff041f41),
                                                  /*fontSize: 20,
                                                fontWeight:
                                                FontWeight.w600,*/
                                                ),
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),

                                        /*Center(
                                        child: Row(
                                                children: [
                                                  /*Image.asset(
                                                    "assets/logos/webcast.png",
                                                    height: 40,
                                                  ),
                                                  SizedBox(
                                                    width: 10,
                                                  ),*/
                                                  Flexible(
                                                    child: Text(
                                                      "Login to your account",
                                                      style: TextStyle(fontSize: 16),
                                                      overflow: TextOverflow.ellipsis,
                                                    ),
                                                  ),
                                                ],

                                        ),
                                      ),*/
                                        const SizedBox(height: 10),
                                        Padding(
                                          padding: EdgeInsets.symmetric(
                                            vertical: 3,
                                          ),
                                          child: Text("Email Address"),
                                        ),

                                        TextFormField(
                                          validator: (value) {
                                            if (value!.trim().isEmpty) {
                                              return 'Email is required!';
                                            }
                                            /*
                                          if (!EmailValidator.validate(value)) {
                                            return 'Email is invalid!';
                                          }*/
                                            return null;
                                          },
                                          onSaved: (value) {
                                            //carPlate = value!.trim();
                                          },
                                          controller: _emailController,
                                          keyboardType:
                                              TextInputType.emailAddress,
                                          /*style: TextStyle(color: Colors.white),*/
                                          decoration: InputDecoration(
                                            prefixIcon: const Icon(Icons.mail),
                                            fillColor: Colors.grey[100],
                                            filled: false,
                                            contentPadding:
                                                const EdgeInsets.symmetric(
                                                  vertical: 15.0,
                                                ),
                                            hintText: 'Email Address',
                                            /*labelStyle: const TextStyle(color: Colors.red),
                                          focusColor: const Color(0xffeb148d),*/
                                            border: OutlineInputBorder(
                                              borderRadius: BorderRadius.all(
                                                Radius.circular(10),
                                              ),
                                              borderSide: BorderSide(width: 0),
                                            ),
                                          ),
                                        ),

                                        const SizedBox(height: 20),
                                        Padding(
                                          padding: EdgeInsets.symmetric(
                                            vertical: 3,
                                          ),
                                          child: Text("Password"),
                                        ),
                                        TextFormField(
                                          controller: _passwordController,
                                          obscureText: hidePassword,
                                          /*style: TextStyle(color: Colors.white),*/
                                          decoration: InputDecoration(
                                            prefixIcon: const Icon(Icons.lock),
                                            fillColor: Colors.grey[100],
                                            filled: false,
                                            contentPadding:
                                                const EdgeInsets.symmetric(
                                                  vertical: 15,
                                                ),
                                            hintText: 'Password',

                                            /*labelStyle:
                                                const TextStyle(color: Colors.amber),*/
                                            suffixIcon: InkWell(
                                              onTap: () {
                                                setState(() {
                                                  hidePassword = !hidePassword;
                                                });
                                              },
                                              child: Icon(
                                                !hidePassword
                                                    ? Icons.visibility
                                                    : Icons.visibility_off,
                                              ),
                                            ),

                                            border: OutlineInputBorder(
                                              borderRadius: BorderRadius.all(
                                                Radius.circular(10),
                                              ),
                                              borderSide: BorderSide(width: 0),
                                            ),
                                          ),
                                          onSaved: (value) {
                                            //phone = value!.trim();
                                          },
                                          validator: (value) {
                                            if (value!.trim().isEmpty) {
                                              return 'Password is required';
                                            }
                                            return null;
                                          },
                                        ),
                                        const SizedBox(height: 20),
                                        Center(
                                          child: InkWell(
                                            onTap: () {
                                              Navigator.of(
                                                context,
                                              ).pushNamed('/reset_password');
                                            },
                                            child: Text("Forgot Password?"),
                                          ),
                                        ),
                                        const SizedBox(height: 20),
                                        Container(
                                          height: 55,
                                          decoration: BoxDecoration(gradient: LinearGradient(
                                            begin: Alignment.topRight,
                                            end: Alignment.bottomLeft,
                                            colors: [const Color(0xff004e92),const Color(0xff000428), ],
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
                                              backgroundColor:
                                                  Colors.transparent,
                                            ),
                                            onPressed: () async {
                                              if (_formKey.currentState!
                                                  .validate()) {
                                                FocusScope.of(
                                                  context,
                                                ).unfocus();
                                                await login();
                                                if (!loggedin) {
                                                  // flutter defined function

                                                  ScaffoldMessenger.of(
                                                    context,
                                                  ).showSnackBar(
                                                    SnackBar(
                                                      content: Text(
                                                        'Error: $errors',
                                                      ),
                                                    ),
                                                  );
                                                } else {
                                                  if (Credentials()
                                                      .getIsOTPVerified() /* &&
                                                  Credentials().getIsEmailVerified()*/ ) {
                                                    // if (widget.isCheckout) {
                                                    //   SchedulerBinding.instance
                                                    //       .addPostFrameCallback((_) {
                                                    //     if (context.mounted) {
                                                    //       Navigator.pushReplacementNamed(
                                                    //           context, '/checkout');
                                                    //     }
                                                    //   });
                                                    // } else {
                                                    SchedulerBinding.instance
                                                        .addPostFrameCallback((
                                                          _,
                                                        ) {
                                                          if (context.mounted) {
                                                            Navigator.of(
                                                              context,
                                                            ).pushNamedAndRemoveUntil(
                                                              "/home",
                                                              (
                                                                Route<dynamic>
                                                                route,
                                                              ) => false,
                                                            );
                                                            /*Navigator.pushAndRemoveUntil(
                                                        context,
                                                        MaterialPageRoute(
                                                          builder: (context) =>
                                                              HomeScreen(
                                                            index:
                                                                0, //navigate to account
                                                          ),
                                                        ),
                                                        (route) => false);*/
                                                          }
                                                        });
                                                  }
                                                  /*} else if (Credentials()
                                                  .getIsEmailVerified()) {
                                                Navigator.pushReplacementNamed(
                                                    // ignore: use_build_context_synchronously
                                                    context,
                                                    '/email_otp');
                                              } */
                                                  else {
                                                    Navigator.pushNamedAndRemoveUntil(
                                                      // ignore: use_build_context_synchronously
                                                      context,
                                                      '/phone-otp',
                                                      (Route<dynamic> route) =>
                                                          false,
                                                    );
                                                  }
                                                }
                                              } else {
                                                return showDialog<void>(
                                                  context: context,
                                                  barrierDismissible:
                                                      false, // user must tap button!
                                                  builder: (BuildContext context) {
                                                    return AlertDialog(
                                                      title: const Text(
                                                        'Invalid Details',
                                                        style: TextStyle(
                                                          fontWeight:
                                                              FontWeight.w700,
                                                        ),
                                                      ),
                                                      content:
                                                          const SingleChildScrollView(
                                                            child: ListBody(
                                                              children: [
                                                                Text(
                                                                  'Make sure you have entered correct details before proceeding!',
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                      actions: [
                                                        TextButton(
                                                          child: const Text(
                                                            'Close',
                                                          ),
                                                          onPressed: () {
                                                            Navigator.of(
                                                              context,
                                                            ).pop();
                                                          },
                                                        ),
                                                      ],
                                                    );
                                                  },
                                                );
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
                                                              color:
                                                                  Colors.white,
                                                            ),
                                                      )
                                                    : const Icon(
                                                        Icons.login,
                                                        color: Colors.white,
                                                      ),
                                                const SizedBox(width: 10),
                                                Text(
                                                  isLoading
                                                      ? 'Signing In...'
                                                      : 'LOGIN',
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
                                                "/register",
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
                                                      "Don't have an account? Register",
                                                      style: TextStyle(
                                                        color: Color(
                                                          0xff2497f3,
                                                        ),
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                      textAlign:
                                                          TextAlign.center,
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

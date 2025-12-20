import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class IndexScreen extends StatefulWidget {
  final bool isDarkMode;
  const IndexScreen({super.key, required this.isDarkMode});

  @override
  State<IndexScreen> createState() => _IndexScreenState();
}

class _IndexScreenState extends State<IndexScreen> {
  final pageController = PageController();
  bool isLastPage = false;

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: widget.isDarkMode
            ? Brightness.light
            : Brightness.dark,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: widget.isDarkMode
            ? Brightness.light
            : Brightness.dark,
      ),
      child: Scaffold(
        resizeToAvoidBottomInset: true,
        body: Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).padding.bottom, // ⬅ prevents overlap
          ),
          child: Column(
            children: [
              Expanded(
                child: ListView(
                  //mainAxisAlignment: MainAxisAlignment.end,
                  //crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(30.0),
                      child: Image.asset(
                        "assets/logos/webcast.png",
                        height: 200,
                      ),
                    ),
                    /*Padding(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 10),
                            child: SizedBox(
                              height: MediaQuery.of(context).size.height * 0.5,
                              child: SvgPicture.asset(
                                'assets/images/my-location.svg',
                                /*colorFilter: const ColorFilter.mode(
                                                            Colors.green, BlendMode.srcIn)*/
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              "MediMeet",
                              style: const TextStyle(
                                  fontSize: 25, fontWeight: FontWeight.bold),
                              textAlign: TextAlign.center,
                            ),
                          ),*/
                    const SizedBox(height: 15),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40.0),
                      child: RichText(
                        textAlign: TextAlign.center,
                        text: TextSpan(
                          text: "Growing your social engagement is ",
                          style: TextStyle(
                            color: widget.isDarkMode
                                ? Colors.white70
                                : Colors.black,
                            fontSize: 25,
                            fontWeight: FontWeight.bold,
                            fontFamily: "poppins",
                          ),

                          children: [
                            TextSpan(
                              text: "easier",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.indigo,
                              ),
                            ),
                            TextSpan(text: " than you think!"),
                          ],
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 40.0,
                        vertical: 20,
                      ),
                      child: Text(
                        "Enjoy limitless livestreams for free!",
                        style: const TextStyle(fontSize: 17),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
              Padding(padding: EdgeInsets.all(30), child: getStarted()),
            ],
          ),
        ),
      ),
    );
  }

  Widget getStarted() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          decoration: BoxDecoration(
            color: Color(0xff2497f3),
            borderRadius: BorderRadius.circular(100),
          ),
          height: 55,
          width: MediaQuery.of(context).size.width,
          child: TextButton(
            style: TextButton.styleFrom(backgroundColor: Color(0xff2497f3)),
            onPressed: () {
              Navigator.pushNamed(context, '/register');
            },
            child: const Text(
              "Get Started",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        SizedBox(height: 30),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Color(0xff2497f3), width: 2),
          ),
          height: 55,
          width: MediaQuery.of(context).size.width,
          child: TextButton(
            style: TextButton.styleFrom(
              backgroundColor: Colors.transparent,
              foregroundColor: widget.isDarkMode
                  ? Colors.white70
                  : Color(0xff2497f3),
            ),
            onPressed: () {
              Navigator.pushNamed(context, '/login');
            },
            child: const Text(
              "Sign In",
              style: TextStyle(
                /*color: Color(0xffFF3D71), */ fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ],
    );
  }
}

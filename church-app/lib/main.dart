import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_projects/api/api_auth_service.dart';
import 'package:flutter_projects/api/dio_client.dart';
import 'package:flutter_projects/screens/auth/login_screen.dart';
import 'package:flutter_projects/screens/auth/phone_otp_screen.dart';
import 'package:flutter_projects/screens/auth/register_screen.dart';
import 'package:flutter_projects/screens/dashboard/dashboard_screen.dart';
import 'package:flutter_projects/screens/dashboard/streaming/stream_screen.dart';
import 'package:flutter_projects/screens/index_screen.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';

String initialRoute = '/index';
void main() async{
  final WidgetsBinding binding = WidgetsFlutterBinding.ensureInitialized();
  await _checkPermissions();
  // Make sure SharedPreferences is ready before adding interceptor
  await SharedPreferences.getInstance();
  DioClient.addInterceptors();
  //DioClient.addInterceptors();
  // Keep native splash on until init finishes
  FlutterNativeSplash.preserve(
      widgetsBinding: binding);
  await _initializeApp();

  runApp(const MyApp());
}

Future<void> _checkPermissions() async {
  var status = await Permission.bluetooth.request();
  if (status.isPermanentlyDenied) {
    print('Bluetooth Permission disabled');
  }
  status = await Permission.bluetoothConnect.request();
  if (status.isPermanentlyDenied) {
    print('Bluetooth Connect Permission disabled');
  }
}
Future<void> _initializeApp() async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('token');
  if (token != null) {
    final ApiAuthService apiService = ApiAuthService();
    try {
      final result = await apiService.profile();
      if (result['user'] != null) {
        initialRoute = "/home";
      } else {
        initialRoute = "/login";
      }
    } catch (e) {
      debugPrint('Error: $e');
    }
  }
  FlutterNativeSplash.remove();
}
class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void _toggleTheme() {
    setState(() {
      _themeMode =
      _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    });
  }

  // Call this method based on theme
  void setSystemUIOverlay(Brightness brightness) {
    if (brightness == Brightness.dark) {
      SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
        systemNavigationBarColor: Colors.black,
        systemNavigationBarIconBrightness: Brightness.light,
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
      ));
    } else {
      SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
        systemNavigationBarColor: Colors.grey.shade50,
        systemNavigationBarIconBrightness: Brightness.dark,
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
      ));
    }
  }

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      //navigatorKey: NavigationService.navigatorKey,
      //initialRoute: initialRoute, //'/',
      initialRoute: initialRoute,
      debugShowCheckedModeBanner: false,
      title: 'Vidcast',
      themeMode: _themeMode,
      theme: ThemeData(
          fontFamily: "Poppins",
          brightness: Brightness.light,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
          primarySwatch: Colors.indigo,
          scaffoldBackgroundColor: Colors.grey.shade50,
          useMaterial3: true,
          textButtonTheme: TextButtonThemeData(
            style: TextButton.styleFrom(
              foregroundColor: Colors.white, // Text/Icon color
              backgroundColor: Colors.indigo, // Background color
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              textStyle: const TextStyle(
                  fontWeight: FontWeight.bold, fontFamily: "Poppins"),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
          ),
          extensions: []),
      darkTheme: ThemeData(
        fontFamily: 'Poppins',
        brightness: Brightness.dark,
        colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.indigo, brightness: Brightness.dark),
        primarySwatch: Colors.indigo,
        scaffoldBackgroundColor: Colors.black87,
        useMaterial3: true,
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: Colors.white, // Text/Icon color
            backgroundColor: Colors.indigo.shade500, // Background color
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            textStyle: const TextStyle(
                fontWeight: FontWeight.bold, fontFamily: "Poppins"),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
          ),
        ),
      ),
      routes: {
        '/login':(context)=>LoginScreen(isDarkMode:  _themeMode == ThemeMode.dark),
        '/register':(context)=>RegisterScreen(isDarkMode:  _themeMode == ThemeMode.dark),
        '/phone-otp':(context)=>PhoneOtpScreen(isDarkMode:  _themeMode == ThemeMode.dark),
        '/index': (context) =>
            IndexScreen(isDarkMode: _themeMode == ThemeMode.dark),
        '/home': (context) =>
            DashboardScreen(isDarkMode: _themeMode == ThemeMode.dark),
        '/stream': (context) =>
            StreamScreen(isDarkMode: _themeMode == ThemeMode.dark),
      },
    );
  }
}

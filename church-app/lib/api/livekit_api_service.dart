import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_projects/api/dio_client.dart';
import 'package:flutter_projects/credentials.dart';
import 'package:flutter_projects/models/role.dart';
import 'package:flutter_projects/models/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LivekitApiService {
  final _dio = DioClient.dio;

  Future<Map<String, dynamic>> getToken() async {
    try {
      Response response = await _dio.post(
        '/api/dashboard/livekit/token',
      );
      if (response.statusCode == 200) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        final data = response.data;
        return {'response': data};
      } else {
        throw Exception('Unable to get livekit token: ${response.statusCode}');
      }
    } on DioException catch (error) {
      if (error.response != null) {
        //final statusCode = error.response?.statusCode;
        var serverMessage = error.response?.data['message'] ?? "Unknown error";
        if (error.response?.data['error'] != null) {
          serverMessage = error.response?.data['error'];
        }

        return {'message': serverMessage};
      }
      //throw Exception('Failed to login: $error');
      debugPrint('Login Error: $error');
      return {'message': 'Oops! Server Error'};
    }
  }

  Future<Map<String, dynamic>> register({
    required firstName,
    required lastName,
    required phone,
    required String email,
    required String password,
    required passwordConfirmation,
    String termsAndConditions = "",
  }) async {
    try {
      Response response = await _dio.post(
        '/api/register',
        data: {
          "firstname": firstName,
          "lastname": lastName,
          "phone": phone,
          "email": email,
          "password": password,
          "password_confirmation":passwordConfirmation,
          "terms_and_conditions":termsAndConditions
        },
      );
      if (response.statusCode == 200) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        final data = response.data;
        prefs.setString('token', data["access_token"]);
        prefs.setInt('user_id', data['user']['id']);
        prefs.setString(
          'name',
          "${data['user']['firstname']} ${data['user']['lastname']}",
        );
        prefs.setString('email', "${data['user']['email']}");
        prefs.setString('phone', data['user']['phone']);
        prefs.setString('image', data['user']['image'] ?? "");

        Credentials().setUser(User.fromJson(data['user']));
        Credentials().setName(
          "${data['user']['firstname']} ${data['user']['lastname']}",
        );
        Credentials().setPhone("${data['user']['phone']}");
        Credentials().setImage(data['user']['image'] ?? "");
        //debugPrint("Access Token: ${data["access_token"]}");
        List<Role> roles = (data["user"]["roles"] as List)
            .map((json) => Role.fromJson(json))
            .toList();
        for (Role role in roles) {
          Credentials().setRole(role.name);
          //localStorage.setString("role", role.name);
        }
        List<String> permissions = List<String>.from(data["permissions"] ?? []);
        Credentials().setPermission(permissions);
        if (data['user']['phone_verified_at'] != null) {
          Credentials().setIsOTPVerified(true);
        }
        return {'user': data['user']};
      } else {
        throw Exception('Unable to login: ${response.statusCode}');
      }
    } on DioException catch (error) {
      if (error.response != null) {
        //final statusCode = error.response?.statusCode;
        var serverMessage = error.response?.data['message'] ?? "Unknown error";
        if (error.response?.data['error'] != null) {
          serverMessage = error.response?.data['error'];
        }
        if (error.response?.data['errors'] != null) {
          //serverMessage = "Invalid Form";
          //print(error.response?.data['errors']);
          return {
            'message': 'Validation failed',
            'errors': Map<String, dynamic>.from(error.response?.data['errors']),
          };
        }

        return {'message': serverMessage};
      }
      //throw Exception('Failed to login: $error');
      debugPrint('Login Error: $error');
      return {'message': 'Oops! Server Error'};
    }
  }

  Future<Map<String, dynamic>> profile() async {
    try {
      Response response = await _dio.get('/api/dashboard/profile');
      if (response.statusCode == 200) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        final data = response.data;
        //debugPrint("RESPONSE FROM PROFILE: $data");
        prefs.setInt('user_id', data['user']['id']);
        //debugPrint("USER ID: ${data['user']['id']}");
        prefs.setString(
          'name',
          "${data['user']['firstname']} ${data['user']['lastname']}",
        );
        prefs.setString('email', "${data['user']['email']}");
        prefs.setString('phone', data['user']['phone']);
        prefs.setString('image', data['user']['image'] ?? "");

        Credentials().setUser(User.fromJson(data['user']));
        Credentials().setName(
          "${data['user']['firstname']} ${data['user']['lastname']}",
        );
        Credentials().setPhone("${data['user']['phone']}");
        Credentials().setImage(data['user']['image'] ?? "");
        List<Role> roles = (data["user"]["roles"] as List)
            .map((json) => Role.fromJson(json))
            .toList();
        for (Role role in roles) {
          Credentials().setRole(role.name);
          //localStorage.setString("role", role.name);
        }
        List<String> permissions = List<String>.from(data["permissions"] ?? []);
        Credentials().setPermission(permissions);
        if (data['user']['phone_verified_at'] != null) {
          Credentials().setIsOTPVerified(true);
        }
        return {'user': data['user']};
      } else {
        throw Exception('Unable to login: ${response.statusCode}');
      }
    } on DioException catch (error) {
      if (error.response != null) {
        //final statusCode = error.response?.statusCode;
        var serverMessage = error.response?.data['message'] ?? "Unknown error";
        if (error.response?.data['error'] != null) {
          serverMessage = error.response?.data['error'];
        }

        return {'message': serverMessage};
      }
      //throw Exception('Failed to login: $error');
      debugPrint('Login Error: $error');
      return {'message': 'Oops! Server Error'};
    }
  }

  Future<Map<String, dynamic>> generatePhoneVerificationCode() async {
    try {
      Response response = await _dio.post('/api/phone_verification_code');
      if (response.statusCode == 200) {
        final data = response.data;
        return {'success': data['success']};
      } else {
        throw Exception('Unable to Send Otp: ${response.statusCode}');
      }
    } on DioException catch (error) {
      if (error.response != null) {
        //final statusCode = error.response?.statusCode;
        var serverMessage = error.response?.data['message'] ?? "Unknown error";
        if (error.response?.data['error'] != null) {
          serverMessage = error.response?.data['error'];
        }

        return {'message': serverMessage};
      }
      //throw Exception('Failed to login: $error');
      debugPrint('Send Otp Error: $error');
      return {'message': 'Oops! Server Error'};
    }
  }

  Future<Map<String, dynamic>> validatePhoneVerificationCode({
    required String otp,
  }) async {
    try {
      Response response = await _dio.post(
        '/api/validate_phone',
        data: {'verification_code': otp},
      );
      if (response.statusCode == 200) {
        final data = response.data;
        Credentials().setUser(User.fromJson(data['user']));
        Credentials().setIsOTPVerified(true);
        return {'success': data['success']};
      } else {
        throw Exception('Unable to login: ${response.statusCode}');
      }
    } on DioException catch (error) {
      if (error.response != null) {
        //final statusCode = error.response?.statusCode;
        var serverMessage = error.response?.data['message'] ?? "Unknown error";
        if (error.response?.data['error'] != null) {
          serverMessage = error.response?.data['error'];
        } else if (error.response?.data?['errors'] != null) {
          final errors = error.response?.data?['errors'];
          final errorMessage = errors.values.first[0];
          throw Exception('$errorMessage');
        }

        return {'message': serverMessage};
      }
      //throw Exception('Failed to login: $error');
      debugPrint('Login Error: $error');
      return {'message': 'Oops! Server Error'};
    }
  }

  Future<Map<String, dynamic>> logout() async {
    try {
      Response response = await _dio.post('/api/logout');
      if (response.statusCode == 200) {
        SharedPreferences prefs = await SharedPreferences.getInstance();
        final data = response.data;
        if (data['message'] == "Successfully logged out") {
          prefs.remove('token');
          prefs.remove('user_id');
          prefs.remove('name');
          prefs.remove('email');
          prefs.remove('phone');
          prefs.remove('image');
          Credentials().unset();
          return {'message': data['message'], 'success': true};
        } else {
          return {
            'message': data['message'] ?? "Oops! Unable to logout",
            'success': false,
          };
        }
      } else {
        throw Exception('Unable to logout: ${response.statusCode}');
      }
    } on DioException catch (error) {
      if (error.response != null) {
        //final statusCode = error.response?.statusCode;
        var serverMessage = error.response?.data['message'] ?? "Unknown error";
        if (error.response?.data['error'] != null) {
          serverMessage = error.response?.data['error'];
        }

        return {'message': serverMessage};
      }
      //throw Exception('Failed to login: $error');
      debugPrint('Logout Error: $error');
      return {'message': 'Oops! Server Error'};
    }
  }
}

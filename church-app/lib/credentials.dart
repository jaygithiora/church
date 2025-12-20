import 'package:flutter_projects/models/user.dart';

class Credentials {
  static bool isOTPVerified = false;
  static User? user;
  static String name = "";
  static String phone = "";
  static String role = "";
  static String image = "";

  static List permissions = [];

  bool getIsOTPVerified() {
    return isOTPVerified;
  }

  setIsOTPVerified(bool n) {
    isOTPVerified = n;
  }

  User? getUser() {
    return user;
  }

  setUser(User u) {
    user = u;
  }

  setName(String n) {
    name = n;
  }

  String getName() {
    return name;
  }

  setPhone(String n) {
    phone = n;
  }

  String getPhone() {
    return phone;
  }

  setPermission(List p) {
    permissions = p;
  }

  List getPermissions() {
    return permissions;
  }

  setRole(String r) {
    role = r;
  }

  String getRole() {
    return role;
  }

  setImage(String img) {
    image = img;
  }

  String getImage() {
    return image;
  }

  unset() {
    name = "";
    phone = "";
    role = "";
    image = "";
    user = null;
    isOTPVerified = false;

    permissions = [];
  }
}
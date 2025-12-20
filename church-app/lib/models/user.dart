
import 'package:flutter_projects/models/role.dart';

class User {
  int id;
  String firstname;
  String lastname;
  String? email;
  String? image;
  String phone;
  bool status;
  String createdAt;
  List<Role> roles;

  User(
      {required this.id,
        required this.firstname,
        required this.lastname,
        this.email,
        this.image,
        required this.roles,
        required this.phone,
        required this.status,
        required this.createdAt});

  factory User.fromJson(Map<String, dynamic> json) {
    List<Role> tempRoles = [];
    if (json['roles'] != null) {
      List roleResp = json["roles"];
      tempRoles = roleResp.map((role) => Role.fromJson(role)).toList();
    }
    return User(
        id: json['id'],
        firstname: json['firstname'],
        lastname: json['lastname'],
        email: json['email'],
        phone: json["phone"],
        image: json['image'],
        roles: tempRoles,
        status: json["status"] == 1 ? true : false,
        createdAt: json["created_at"]);
  }
}
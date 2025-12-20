import 'package:flutter/material.dart';

class MyInputDecorations {
  static InputDecoration textFieldDecoration({
    required String label,
    String? hint,
    IconData? icon,
    String? prefix,
  }) {
    return InputDecoration(
      counterText: "",
      labelText: label,
      hintText: hint,
      prefix: Text(prefix ?? ""),
      prefixIcon: icon != null ? Icon(icon) : null,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: Colors.brown),
      ),
      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 5),
      alignLabelWithHint: true,
    );
  }
}
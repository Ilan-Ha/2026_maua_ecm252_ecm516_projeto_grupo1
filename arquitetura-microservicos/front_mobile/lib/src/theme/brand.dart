import 'package:flutter/material.dart';

/// Verde AllForOne (mesmo do React / botões / login).
class Brand {
  static const green = Color(0xFF377F3F);
  static const greenDark = Color(0xFF2C6633);
  static const greenSoft = Color(0xFFE8F3E9);
  static const greenMuted = Color(0xFFD4E8D6);

  static ThemeData theme() {
    final scheme = ColorScheme.fromSeed(
      seedColor: green,
      primary: green,
      brightness: Brightness.light,
    );
    return ThemeData(
      useMaterial3: true,
      colorScheme: scheme.copyWith(
        primary: green,
        secondary: greenDark,
        surface: Colors.white,
      ),
      scaffoldBackgroundColor: const Color(0xFFF7FAF7),
      appBarTheme: const AppBarTheme(
        backgroundColor: greenSoft,
        foregroundColor: greenDark,
        elevation: 0,
        centerTitle: true,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: green,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(foregroundColor: green),
      ),
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: green,
        foregroundColor: Colors.white,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(color: green),
    );
  }
}

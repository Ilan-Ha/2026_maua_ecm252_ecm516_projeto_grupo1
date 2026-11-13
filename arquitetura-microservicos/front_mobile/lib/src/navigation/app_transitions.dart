import 'package:flutter/material.dart';

/// Troca de seção: fade curto (sem slide lateral).
Route<T> fadeRoute<T extends Object?>(
  Widget page, {
  RouteSettings? settings,
  bool opaque = true,
}) {
  return PageRouteBuilder<T>(
    settings: settings,
    opaque: opaque,
    transitionDuration: const Duration(milliseconds: 220),
    reverseTransitionDuration: const Duration(milliseconds: 180),
    pageBuilder: (_, __, ___) => page,
    transitionsBuilder: (_, animation, __, child) {
      final curved = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
        reverseCurve: Curves.easeInCubic,
      );
      return FadeTransition(
        opacity: curved,
        child: child,
      );
    },
  );
}

/// Detalhe / modal leve: fade + leve scale.
Route<T> softScaleRoute<T extends Object?>(
  Widget page, {
  RouteSettings? settings,
}) {
  return PageRouteBuilder<T>(
    settings: settings,
    transitionDuration: const Duration(milliseconds: 240),
    reverseTransitionDuration: const Duration(milliseconds: 180),
    pageBuilder: (_, __, ___) => page,
    transitionsBuilder: (_, animation, __, child) {
      final curved = CurvedAnimation(
        parent: animation,
        curve: Curves.easeOutCubic,
      );
      return FadeTransition(
        opacity: curved,
        child: ScaleTransition(
          scale: Tween<double>(begin: 0.98, end: 1).animate(curved),
          child: child,
        ),
      );
    },
  );
}

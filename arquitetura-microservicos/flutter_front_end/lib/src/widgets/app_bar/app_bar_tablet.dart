import 'package:flutter/material.dart';

class AppBarTablet extends StatelessWidget {
  const AppBarTablet({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: const Image(
        image: AssetImage('assets/images/AllForOne_Logo.png'),
      ),
    );
  }
}

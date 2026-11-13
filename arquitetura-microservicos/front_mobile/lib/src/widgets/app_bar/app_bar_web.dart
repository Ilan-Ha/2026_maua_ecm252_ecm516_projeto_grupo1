import 'package:flutter/material.dart';

class AppBarWeb extends StatelessWidget {
  const AppBarWeb({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: const Image(
        image: AssetImage('assets/images/AllForOne_Logo.png'),
      ),
    );
  }
}

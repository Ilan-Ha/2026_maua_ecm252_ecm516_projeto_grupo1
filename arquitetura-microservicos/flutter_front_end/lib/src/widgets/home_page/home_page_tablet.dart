import 'package:flutter/material.dart';

class HomePageTablet extends StatelessWidget {
  const HomePageTablet({super.key});
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(appBar: AppBar(title: const Text('Tablet'))),
    );
  }
}
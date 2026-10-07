import 'package:flutter/material.dart';

class HomePageMobile extends StatelessWidget {
  const HomePageMobile({super.key});
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(appBar: AppBar(title: const Text('Mobile'))),
    );
  }
}
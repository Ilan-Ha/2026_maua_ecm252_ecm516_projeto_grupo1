import 'package:flutter/material.dart';

class HomePageWeb extends StatelessWidget {
  const HomePageWeb({super.key});
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(appBar: AppBar(title: const Text('Web'))),
    );
  }
}

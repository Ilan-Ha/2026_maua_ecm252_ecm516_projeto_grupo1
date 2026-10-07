import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/break_points.dart';
import 'package:flutter_front_end/src/widgets/home_page/home_page_mobile.dart';
import 'package:flutter_front_end/src/widgets/home_page/home_page_tablet.dart';
import 'package:flutter_front_end/src/widgets/home_page/home_page_web.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState() extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Scaffold(
          body: constraints.maxWidth > breakpointTablet
              ? const HomePageWeb()
              : constraints.maxWidth > breakpointMobile
              ? const HomePageTablet()
              : const HomePageMobile(),
        );
      },
    );
  }
}

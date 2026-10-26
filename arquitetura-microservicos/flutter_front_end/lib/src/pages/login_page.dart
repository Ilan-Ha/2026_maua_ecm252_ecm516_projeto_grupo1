import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/break_points.dart';
import 'package:flutter_front_end/src/widgets/app_bar/app_bar_mobile.dart';
import 'package:flutter_front_end/src/widgets/app_bar/app_bar_tablet.dart';
import 'package:flutter_front_end/src/widgets/app_bar/app_bar_web.dart';
import 'package:flutter_front_end/src/widgets/login_page/Login_page_web.dart';
import 'package:flutter_front_end/src/widgets/login_page/login_page_mobile.dart';
import 'package:flutter_front_end/src/widgets/login_page/login_page_tablet.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState() extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Scaffold(
          appBar: constraints.maxWidth > breakpointTablet
              ? const PreferredSize(
                  preferredSize: Size(double.infinity, 60),
                  child: AppBarWeb(),
                )
              : constraints.maxWidth > breakpointMobile
              ? const PreferredSize(
                  preferredSize: Size(double.infinity, 60),
                  child: AppBarTablet(),
                )
              : const PreferredSize(
                  preferredSize: Size(double.infinity, 56),
                  child: AppBarMobile(),
                ),
          body: constraints.maxWidth > breakpointTablet
              ? const LoginPageWeb()
              : constraints.maxWidth > breakpointMobile
              ? const LoginPageTablet()
              : const LoginPageMobile(),
        );
      },
    );
  }
}

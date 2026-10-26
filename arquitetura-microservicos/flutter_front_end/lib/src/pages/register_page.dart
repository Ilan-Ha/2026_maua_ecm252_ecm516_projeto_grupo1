import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/break_points.dart';
import 'package:flutter_front_end/src/widgets/app_bar/app_bar_mobile.dart';
import 'package:flutter_front_end/src/widgets/app_bar/app_bar_tablet.dart';
import 'package:flutter_front_end/src/widgets/app_bar/app_bar_web.dart';
import 'package:flutter_front_end/src/widgets/register_page/register_page_mobile.dart';
import 'package:flutter_front_end/src/widgets/register_page/register_page_tablet.dart';
import 'package:flutter_front_end/src/widgets/register_page/register_page_web.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState() extends State<RegisterPage> {
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
              ? const RegisterPageWeb()
              : constraints.maxWidth > breakpointMobile
              ? const RegisterPageTablet()
              : const RegisterPageMobile(),
        );
      },
    );
  }
}

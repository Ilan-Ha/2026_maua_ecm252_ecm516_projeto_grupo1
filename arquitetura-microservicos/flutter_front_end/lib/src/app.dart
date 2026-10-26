import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/page_routes.dart';
import 'package:flutter_front_end/src/pages/login_page.dart';
import 'package:flutter_front_end/src/pages/register_page.dart';

import 'pages/home_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: .fromSeed(seedColor: Colors.green),
      ),
      home: const HomePage(),
      routes: {
        homePage:     (context) => const HomePage(),
        loginPage:    (context) => const LoginPage(),
        registerPage: (context) => const RegisterPage()
      },
    );
  }
}


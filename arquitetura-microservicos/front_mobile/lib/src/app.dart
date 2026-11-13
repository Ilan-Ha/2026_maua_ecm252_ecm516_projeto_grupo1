import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/routes.dart';
import 'package:front_mobile/src/pages/compare_page.dart';
import 'package:front_mobile/src/pages/history_page.dart';
import 'package:front_mobile/src/pages/home_page.dart';
import 'package:front_mobile/src/pages/login_page.dart';
import 'package:front_mobile/src/pages/product_page.dart';
import 'package:front_mobile/src/pages/profile_page.dart';
import 'package:front_mobile/src/pages/register_page.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AllForOne',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF377F3F)),
        useMaterial3: true,
      ),
      initialRoute: AppRoutes.home,
      onGenerateRoute: (settings) {
        final name = settings.name ?? AppRoutes.home;
        if (name.startsWith('${AppRoutes.product}/')) {
          final id = name.substring('${AppRoutes.product}/'.length);
          return MaterialPageRoute(
            builder: (_) => ProductPage(productId: id),
            settings: settings,
          );
        }
        switch (name) {
          case AppRoutes.home:
            return MaterialPageRoute(builder: (_) => const HomePage());
          case AppRoutes.login:
            return MaterialPageRoute(builder: (_) => const LoginPage());
          case AppRoutes.register:
            return MaterialPageRoute(builder: (_) => const RegisterPage());
          case AppRoutes.profile:
            return MaterialPageRoute(builder: (_) => const ProfilePage());
          case AppRoutes.history:
            return MaterialPageRoute(builder: (_) => const HistoryPage());
          case AppRoutes.compare:
            return MaterialPageRoute(builder: (_) => const ComparePage());
          default:
            return MaterialPageRoute(builder: (_) => const HomePage());
        }
      },
    );
  }
}

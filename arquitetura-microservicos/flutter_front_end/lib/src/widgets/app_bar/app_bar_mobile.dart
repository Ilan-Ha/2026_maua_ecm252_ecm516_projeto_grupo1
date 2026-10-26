import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/page_routes.dart';

// ref: https://stackoverflow.com/questions/60353011/drop-down-list-in-flutter-using-an-icon
// ref: https://api.flutter.dev/flutter/material/DropdownMenu-class.html
// ref: https://stackoverflow.com/questions/73196835/how-to-navigate-to-different-pages-through-dropdown-menu
// ref: https://stackoverflow.com/questions/56715403/how-to-add-onclick-on-image-asset-in-flutter

class AppBarMobile extends StatelessWidget {
  const AppBarMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: IconButton(
        onPressed: () {},
        icon: const Icon(Icons.menu, color: Colors.black),
      ),
      backgroundColor: Colors.white,
      centerTitle: true,
      title: SizedBox(
        width: 120,
        child: GestureDetector(
          onTap: () {
            Navigator.pushNamed(context, homePage);
          },
          child: Image(image: AssetImage('assets/images/AllForOne_Logo.png')),
        ),
      ),
      actionsPadding: EdgeInsetsGeometry.only(right: 32),
      actions: [
        PopupMenuButton<String>(
          icon: Icon(Icons.account_circle_rounded),
          tooltip: 'Login e Cadastro',
          onSelected: (String result) {
            switch (result) {
              case 'login':
                Navigator.pushNamed(context, loginPage);
                break;
              case 'register':
                Navigator.pushNamed(context, registerPage);
                break;
              default:
            }
          },
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            PopupMenuItem<String>(
              value: 'login',
              child: Row(
                spacing: 8,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [Icon(Icons.login), Text('Login')],
              ),
            ),
            const PopupMenuItem<String>(
              value: 'register',
              child: Row(
                spacing: 8,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [Icon(Icons.create_outlined), Text('Cadastro')],
              ),
            ),
          ],
        ),
      ],
      // actions: [
      //   Padding(
      //     padding: EdgeInsets.symmetric(horizontal: 8),
      //     child: IconButton(
      //       onPressed: (){},
      //       icon: Icon(Icons.shopping_cart),
      //       tooltip: 'Catálogo',)),
      //   Padding(
      //     padding: EdgeInsets.symmetric(horizontal: 8),
      //     child: IconButton(
      //       onPressed: (){},
      //       icon: Icon(Icons.compare),
      //       tooltip: 'Comparação',)),
      //   Padding(padding: EdgeInsets.symmetric(horizontal: 8),
      //     child: IconButton(
      //       onPressed: (){},
      //       icon: Icon(Icons.history),
      //       tooltip: 'Histórico',))
      // ],
    );
  }
}

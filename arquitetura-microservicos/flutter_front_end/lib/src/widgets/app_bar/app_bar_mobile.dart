import 'package:flutter/material.dart';

class AppBarMobile extends StatelessWidget {
  const AppBarMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      title: SizedBox(
        width: 120,
        child: Image(image: AssetImage('assets/images/AllForOne_Logo.png')),),
        actionsPadding: EdgeInsetsGeometry.only(right: 32),
        actions: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: IconButton(
              onPressed: (){}, 
              icon: Icon(Icons.shopping_cart),
              tooltip: 'Catálogo',)),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: IconButton(
              onPressed: (){}, 
              icon: Icon(Icons.compare),
              tooltip: 'Comparação',)),
          Padding(padding: EdgeInsets.symmetric(horizontal: 8),
            child: IconButton(
              onPressed: (){}, 
              icon: Icon(Icons.history),
              tooltip: 'Histórico',))
        ],
    );
  }
}

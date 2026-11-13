import 'package:flutter/material.dart';
import 'package:front_mobile/src/config/api_config.dart';
import 'package:front_mobile/src/theme/textstyle.dart';
import 'package:http/http.dart' as http;

import 'dart:convert';

class HomePageMobile extends StatefulWidget {
  const HomePageMobile({super.key});

  @override
  State<HomePageMobile> createState() {
    return HomePageMobileState();
  }
}

class HomePageMobileState extends State<HomePageMobile> {
  List<Widget> images = [Text("Catalogo caregando...")];
  void obterCatalogo() async {
    var url = Uri.http(gatewayUrl, gatewayCatalog, {});

    var req = http.Request('get', url);

    final result = await req.send();
    final response = await http.Response.fromStream(result);
    final decodedJSON = json.decode(response.body);
    final categorias = decodedJSON['Categorias'];
    List<Widget> imagens = [];
    for (var i = 0; i < categorias.length; i++) {
      imagens.add(
        Column(
          children: [
            Image.network(categorias[i]["imagem"],),
            Text(categorias[i]["nome"]),
          ],
        ),
      );
    }
    if (categorias != null) {
      setState(() {
        images = [...imagens];
      });
    }
  }

  @override
  void initState() {
    super.initState();
    obterCatalogo();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Container(
          padding: EdgeInsetsDirectional.symmetric(horizontal: 16),
          alignment: AlignmentGeometry.center,
          child: ListView(
            padding: EdgeInsets.symmetric(vertical: 32),
            children: [
              Container(
                margin: EdgeInsets.only(top: 16, bottom: 8),
                child: Column(
                  children: [
                    Text("CATEGORIAS DE PRODUTOS", style: title),
                    Text(
                      "Explore especificações técnicas e detalhes por categoria",
                      style: subtitle,
                    ),
                  ],
                ),
              ),
              Container(
                margin: EdgeInsets.only(top: 8, bottom: 8),
                child: SearchBar(hintText: "Buscar categoria"),
              ),
              Container(
                margin: EdgeInsets.only(top: 8, bottom: 8),
                child: Column(children: [...images]),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            obterCatalogo();
          },
        ),
      ),
    );
  }
}

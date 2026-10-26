import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/page_routes.dart';
import 'package:http/http.dart' as http;

class RegisterPageMobile extends StatelessWidget {
  const RegisterPageMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(20.0),
      child: Column(
        children: [
          nameField(),
          emailField(),
          passwordField(),
          Container(
            margin: EdgeInsets.only(top: 12.0),
            child: Row(children: [Expanded(child: submitButton())]),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Já tem conta?'),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, loginPage);
                },
                child: Text('Entrar', selectionColor: Colors.green),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

Widget nameField() {
  return TextField(
    keyboardType: TextInputType.name,
    decoration: InputDecoration(hintText: 'seu nome', labelText: 'Nome'),
  );
}

Widget emailField() {
  return TextField(
    keyboardType: TextInputType.emailAddress,
    decoration: InputDecoration(
      hintText: 'seu@email.com',
      labelText: 'Endereço de email',
    ),
  );
}

Widget passwordField() {
  return TextField(
    obscureText: true,
    decoration: InputDecoration(hintText: 'Senha', labelText: 'Senha'),
  );
}

Widget submitButton() {
  return ElevatedButton(
    onPressed: () {
      var url = Uri.http('localhost');
      var req = http.Request('POST', url);
      req.headers.addAll({"Content-Type": "application/json"});
    },
    child: Text('Cadastrar'),
  );
}

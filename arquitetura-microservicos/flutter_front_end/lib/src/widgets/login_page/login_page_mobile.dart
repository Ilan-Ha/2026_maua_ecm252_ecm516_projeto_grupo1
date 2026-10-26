import 'package:flutter/material.dart';
import 'package:flutter_front_end/src/config/page_routes.dart';

class LoginPageMobile extends StatelessWidget {
  const LoginPageMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.all(20.0),
      child: Column(
        children: [
          emailField(),
          passwordField(),
          Container(
            margin: EdgeInsets.only(top: 12.0),
            child: Row(children: [Expanded(child: submitButton())]),
          ),
          Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Não tem conta?'),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, registerPage);
                  },
                  child: Text('Cadastrar', selectionColor: Colors.green),
                ),
              ],
            ),
        ],
      ),
    );
  }
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
  return ElevatedButton(onPressed: () {}, child: Text('Entrar'));
}

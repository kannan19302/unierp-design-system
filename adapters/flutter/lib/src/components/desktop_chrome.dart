// Flutter Design System - UniDesktopChrome layout primitive
import 'package:flutter/material.dart';
import '../tokens/tokens.g.dart';

/// UniDesktopChrome - Canonical native window chrome and layout
class UniDesktopChrome extends StatelessWidget {
  const UniDesktopChrome({
    super.key,
    required this.title,
    required this.body,
  });

  final String title;
  final Widget body;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: UniTokens.bgSunken,
        foregroundColor: UniTokens.text,
        elevation: 0,
      ),
      body: SafeArea(child: body),
    );
  }
}

// Flutter Design System - UniBadge primitive
import 'package:flutter/material.dart';
import '../tokens/tokens.g.dart';

/// UniBadge - Canonical Flutter implementation of Badge primitive
class UniBadge extends StatelessWidget {
  const UniBadge({
    super.key,
    required this.label,
    this.color,
  });

  final String label;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final bg = color ?? UniTokens.primaryLight;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(UniTokens.radiusSm),
      ),
      child: Text(
        label,
        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: UniTokens.primary),
      ),
    );
  }
}

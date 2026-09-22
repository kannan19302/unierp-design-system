// Flutter Design System - UniCard primitive
import 'package:flutter/material.dart';
import '../tokens/tokens.g.dart';

/// UniCard - Canonical Flutter implementation of Card primitive
class UniCard extends StatelessWidget {
  const UniCard({
    super.key,
    required this.child,
    this.padding,
  });

  final Widget child;
  final EdgeInsetsGeometry? padding;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(UniTokens.spaceMd),
      decoration: BoxDecoration(
        color: UniTokens.bgElevated,
        border: Border.all(color: UniTokens.border),
        borderRadius: BorderRadius.circular(UniTokens.radiusLg),
      ),
      child: child,
    );
  }
}

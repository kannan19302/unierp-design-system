// Flutter Design System - UniButton primitive
import 'package:flutter/material.dart';
import '../tokens/tokens.g.dart';

/// UniButton - Canonical Flutter implementation of Button primitive
class UniButton extends StatelessWidget {
  const UniButton({
    super.key,
    required this.label,
    this.onPressed,
    this.primary = true,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool primary;
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary ? UniTokens.primary : UniTokens.bgSunken,
        foregroundColor: primary ? Colors.white : UniTokens.text,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(UniTokens.radiusMd),
          side: primary ? BorderSide.none : const BorderSide(color: UniTokens.border),
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: UniTokens.spaceMd,
          vertical: UniTokens.spaceSm,
        ),
      ),
      onPressed: onPressed,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[icon!, const SizedBox(width: UniTokens.spaceXs)],
          Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

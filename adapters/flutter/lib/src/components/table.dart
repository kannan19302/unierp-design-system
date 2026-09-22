// Flutter Design System - UniTable primitive
import 'package:flutter/material.dart';
import '../tokens/tokens.g.dart';

/// UniTable - Canonical Flutter implementation of DataGrid / Table primitive
class UniTable extends StatelessWidget {
  const UniTable({
    super.key,
    required this.headers,
    required this.rows,
  });

  final List<String> headers;
  final List<List<String>> rows;

  @override
  Widget build(BuildContext context) {
    return Table(
      border: TableBorder.all(color: UniTokens.border),
      children: [
        TableRow(
          decoration: const BoxDecoration(color: UniTokens.bgSunken),
          children: headers
              .map(
                (h) => Padding(
                  padding: const EdgeInsets.all(UniTokens.spaceSm),
                  child: Text(
                    h,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                ),
              )
              .toList(),
        ),
        ...rows.map(
          (row) => TableRow(
            children: row
                .map(
                  (cell) => Padding(
                    padding: const EdgeInsets.all(UniTokens.spaceSm),
                    child: Text(cell, style: const TextStyle(fontSize: 13)),
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:unierp_ui_flutter/unierp_ui.dart';

void main() {
  testWidgets('UniButton renders with label and responds to tap', (WidgetTester tester) async {
    bool tapped = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: UniButton(
            label: 'Submit Action',
            onPressed: () {
              tapped = true;
            },
          ),
        ),
      ),
    );

    expect(find.text('Submit Action'), findsOneWidget);
    await tester.tap(find.text('Submit Action'));
    expect(tapped, isTrue);
  });

  testWidgets('UniBadge renders with text and proper token colors', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: UniBadge(label: 'Active Tenant'),
        ),
      ),
    );

    expect(find.text('Active Tenant'), findsOneWidget);
  });

  testWidgets('UniCard wraps content inside styled container', (WidgetTester tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: UniCard(
            child: Text('Card Content Inside'),
          ),
        ),
      ),
    );

    expect(find.text('Card Content Inside'), findsOneWidget);
  });
}

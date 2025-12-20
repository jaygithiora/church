import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_projects/screens/dashboard/home_screen.dart';

class DashboardScreen extends StatefulWidget {
  final int index;
  final bool isDarkMode;
  const DashboardScreen({super.key, this.index = 0, required this.isDarkMode});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
  int selectedPage = 0;
  late List<Widget> _pageOptions;

  @override
  void initState() {
    selectedPage = widget.index;
    // TODO: implement initState
    super.initState();
    //initCart();
    _pageOptions = [
      HomeScreen(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion(
      value: SystemUiOverlayStyle.dark.copyWith(
          statusBarColor: Colors.indigo,
          systemNavigationBarColor: Colors.white,
          systemNavigationBarIconBrightness: Brightness.dark),
      child: Scaffold(
        resizeToAvoidBottomInset: true,
        key: scaffoldKey,

        body: Stack(
          children: [
            /*Container(
              height: MediaQuery.of(context).size.height,
              width: MediaQuery.of(context).size.width,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/images/my_bg.jpg'),
                  fit: BoxFit.cover
                )
              ),
            ),*/

            _pageOptions[selectedPage],
          ],
        ),
        /*
        floatingActionButton: isKeyboardOpen
            ? null
            : FloatingActionButton(
                elevation: 0,
                shape: CircleBorder(),
                foregroundColor: Colors.white,
                backgroundColor: Colors.green,
                onPressed: () {
                  // Action
                  setState(() {
                    selectedPage = 2;
                  });
                },
                child: Badge(
                  //backgroundColor: Color(0xff1d976c),
                  isLabelVisible: cartCount > 0,
                  label: Text("$cartCount"),
                  child: Icon(Icons.shopping_cart),
                ),
              ),
        floatingActionButtonLocation:
            FloatingActionButtonLocation.miniCenterDocked, */ // Center FAB
        bottomNavigationBar: /*BottomAppBar(
          color: Colors.white,
          //shape: CircularNotchedRectangle(),
          elevation: 8.0,
          child:
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
            buildNavItem(Icons.shopping_bag, "Shop", 0),
            buildNavItem(Icons.receipt_long, "Orders", 1),
            buildNavItem(Icons.delivery_dining, "Deliveries", 3),
            buildNavItem(Icons.person, "Profile", 4),
          ]),

          child: */
        BottomNavigationBar(
          type: BottomNavigationBarType.fixed,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          iconSize: 30,
          items: [
            BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: "Home"),
            BottomNavigationBarItem(
                icon: Icon(Icons.search), label: "Search"),
            BottomNavigationBarItem(
                icon: Icon(Icons.location_on), label: "Location"),

            BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
            //BottomNavigationBarItem(icon: Icon(Icons.help), label: "Help")
          ],
          selectedItemColor: Colors.indigo,
          elevation: 10.0,
          unselectedItemColor: Colors.black87,
          currentIndex: selectedPage,
          backgroundColor: Colors.white,
          onTap: (index) {
            setState(() {
              //print("Index$index");
              selectedPage = index;
            });
          },
        ),
        //),
      ),
    );
  }
}
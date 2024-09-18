import {Dimensions, View} from 'react-native';
import {StyleSheet} from 'react-native';
import { Icon } from 'react-native-paper';
const {width, height} = Dimensions.get('window');

export const styles =  StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor:'black',
  },

  modalButton: {
    width: '95%',
    backgroundColor: '#ffff',
    borderWidth: 0.2,
    marginTop: 5,
    borderRadius: 50,
    paddingVertical: 15,  // Adjust padding vertically
    paddingHorizontal: 15,  // Adjust padding horizontally
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowStyle: {
    paddingVertical:10,
    paddingHorizontal: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    paddingHorizontal: 5,
    color: 'grey',
  },
  rowTextStyle: {
    color: 'grey',
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  modalButtonText: {
    color: 'grey',
    fontSize: 16,
    marginLeft: 10,
  },
  
  bgImage: {
    height: height,
    alignItems: 'center',
  },
  callLogItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
    padding: 5,
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    color: 'black',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: height * 0.05,
    fontWeight: 'bold',
    color: '#34a8eb',
  },
  welcomeSubText: {
    fontSize: height * 0.03,
    color: '#2F3C7E',
  },
  alignCenter: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  inputBox: {
     width: '100%',
    height: 50,
  },
   eyeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 10,
  },
  logoStyle: {
    width: 100,
    height: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,

    backgroundColor:'white',
    borderRadius: 0,
    shadowColor:'#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  contactPhoneNumber: {
    fontSize: 13,
    color: '#777777',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '32%',
    marginLeft: 0,
  },
  editButton: {
    padding: 2,
    backgroundColor: 'white',
    marginRight: 9,
  },
  callButton: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  callImage: {
    width: 26,
    height: 26,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 180,
    margin: 15,
    paddingVertical: 80,
    color:'black',
   
  },
  modalViewColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 0,
    backgroundColor:'white',
    padding: 15,
    borderTopRightRadius: 10,
    borderTopLeftRadius:10,
     height: 280,
    width: width,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: 25,
  },
  fixedLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
    padding: 60,
    borderRadius: 8,
    color: 'black',
  },
  picker: {
    height: 50,
    width: '80%',
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
  },
  buttonBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    width: '90%',
    color:"black",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    width: '50%',
    alignItems: 'center',
     
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  timeText: {
    padding: 16,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  dFlex: {
    display: 'flex',
  },
  
  flexEnd: {
    alignItems: 'flex-end',
  },
  fullHeight: {
    height: '100%',
  },
  fullWidth: {
    width: width,
  },
  bottom: {
    bottom: 0,
  },
  fixedBottom: {
    position: 'fixed',
    bottom: '10px',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  aligalignContentEnd: {
    alignContent: 'flex-end',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  loginInnerContainer: {
    backgroundColor:'white',
    width: width,
    padding: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  loginTextContainer: {
    width: width,
    padding: 40,
  },
  lineChart: {
    borderRadius: 200,
  },
  marginY25: {
    marginVertical: 25,
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 0,
  },
  searchBarInput: {},
  dFlex: {
    display: 'flex',
    padding:0,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentFlexStart: {
    justifyContent: 'flex-start',
  },
  justifyContentSpaceAround: {
    justifyContent: 'space-around',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
  justifyContentSpaceEvenly: {
    justifyContent: 'space-evenly',
  },
  callLogText: {
    fontSize: 16,
    color: "#565656",

  },
  callLogItem: {
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
    padding: 5,
  },
  modalButton: {
    width: '95%',
    backgroundColor: '#ffff',
    borderWidth: 0.2,
    marginTop: 5,
    borderRadius: 50,
    paddingVertical: 15,  // Adjust padding vertically
    paddingHorizontal: 15,  // Adjust padding horizontally
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'grey',
    fontSize: 16,
    marginLeft: 10,
  },
  renderModalIcon: () => (
    <View style={{ marginLeft: 'auto', marginRight: 0 }}>
      <Icon source="chevron-down" size={20} color='grey' />
    </View>
  ),
  modalScrollView: {
    maxHeight: '100%',
    flexGrow: 1,
  },
  dropdownStyle: {
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: '#3498db',
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  rowStyle: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    paddingHorizontal: 5,
  },
  rowTextStyle: {
    color: 'grey',
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  selectedRowStyle: {
    backgroundColor: '#007bff',
  },
  selectedRowTextStyle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
  },
  inputContainer: {
    paddingHorizontal: 5,
    borderRadius: 50,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 5,
  },
  inputBox: {
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    paddingVertical: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    width: '35%',
    alignSelf: 'center',
    
  },
  buttonContainer:{
    flexDirection:'row',
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  headingContainer: {
    marginBottom: 0,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  dFlex: {
    display: 'flex',
  },
  fullWidth: {
    width: '100%',
  },
  justifyContentCenter: {
    justifyContent: 'center',
  },
  justifyContentFlexEnd: {
    justifyContent: 'flex-end',
  },
  justifyContentFlexStart: {
    justifyContent: 'flex-start',
  },
  justifyContentSpaceAround: {
    justifyContent: 'space-around',
  },
  justifyContentSpaceBetween: {
    justifyContent: 'space-between',
  },
  justifyContentSpaceEvenly: {
    justifyContent: 'space-evenly',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  cardButton: {
    width: '100%',
    borderWidth: 0,
  },
  textHighlight: {
    fontSize: 17,
    marginTop: 15,
  },
  ChatTitle:{
   backgroundColor:'#FFFFFF',
   marginBottom:0,
   paddingLeft:9,
   width:'110%',
   borderTopLeftRadius:5
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    fontFamily: 'poppins',
    width: '100%',
  },
  bgPrimary: {
    backgroundColor: '#eaf6fd',
  },
  container: {
    backgroundColor: '#f3f3f3',
    fontFamily: 'poppins',
    paddingHorizontal: '4%',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 15,
  },
  bellIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 2,
    borderRadius: 5,
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
    color: 'grey',
  },
  marginY25: {
    marginVertical: 3,
  },
  userSection: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchBarContainer: {
    marginVertical: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userInfo: {
    flexDirection: 'row',
    margin: 10,
  },
  greatingText: {
    fontSize: 22,
    fontFamily: 'poppins',
    fontWeight: '300',
    color: 'grey',
  },
  cardText: {
    fontSize: 20,
    fontFamily: 'poppins',
    fontWeight: '300',
  },
  cardSubText: {
    fontSize: 15,
    fontFamily: 'poppins',
    fontWeight: '300',
    color: 'grey',
  },
  greatingSubText: {
    fontSize: 22,
    fontFamily: 'poppins',
    fontWeight: 'bold',
    color: '#565656',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  gridItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fefefe',
    borderRadius: 10,
    margin: 5,
  },
  total: {
    fontSize: 20,
    color: 'grey',
  },
  active: {
    fontSize: 20,
    color: 'grey',
  },
  closed: {
    fontSize: 20,
    color: 'grey',
  },
  notificationContainer: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    padding: 10,
  },
  notificationTitle: {
    fontSize: 18,
    color: '#565656',
    marginBottom: 5,
    fontWeight:'bold'
  },
  notificationItem: {
    backgroundColor: '#fefefe',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    elevation: 5,
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom:5
  },
  notificationText: {
    fontSize: 16,
    color: 'grey',
    padding: 6,
  },
});
export const leadDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    marginTop: "5%",
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "white",
  },
  callbtn1: {
    flexDirection: "row",
    padding: 8,
    borderRadius: 19,
    backgroundColor: "#e6effa",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  callbtn2: {
    flexDirection: "row",
    padding: 7,
    borderRadius: 19,
    backgroundColor: "#edfaf0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  callbtn3: {
    flexDirection: "row",
    padding: 7,
    borderRadius: 19,
    backgroundColor: "#f5dadb",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  callbtn4: {
    flexDirection: "row",
    padding: 7,
    borderRadius: 19,
    backgroundColor: "#e9d9fa",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  activeTab: {
    borderBottomColor: "#34a8eb",
  },
  PersonalDetailText: {
    fontSize: 16,
    marginTop: 11,
    marginStart: 11,
    color: "black",
    justifyContent: "space-between",
  },
  detailsContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,

    backgroundColor: "#f7f7f5",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 5,
    justifyContent: "space-between",
  },
  detailsLabel: {
    fontSize: 12,
    color: "black",
    width: "30%",
  },
  commentText: {
    fontSize: 12,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  detailsValue: {
    fontSize: 12,
    color: "black",
    fontWeight: "bold",
    width: "70%",
    paddingStart: 10,
  },
  NameDetails: {
    color: "black",
    fontSize: 12,
    marginTop: 9,
    marginBottom: 11,
  },
  modalButton: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#888", // Adjust border color as needed
    backgroundColor: "#f0f0f0", // Adjust background color as needed
  },
  commentInput: {
    borderColor: "grey",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 25,
    marginTop: 12,
    color: "black",
  },
  commentButton: {
    borderRadius: 1,
  },
  commentViewSection: {
    color: "black",
    fontSize: 12,
    marginTop: 4,
    borderColor: "grey",
    marginBottom: 3,
  },
  PersonDatailsTextStyle: {
    fontSize: 12,
    color: "black",
  },
  callLogItem: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginVertical: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  logText: {
    fontSize: 12,
    color: "black",
  },
});
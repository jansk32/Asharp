import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity,Dimensions, TouchableHighlight, FlatList } from 'react-native';
import Timeline from 'react-native-timeline-feed';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Moment from 'moment';
import { TabView, SceneMap } from 'react-native-tab-view';

// Import date formatting module moment.js
Moment.locale('en');

const numColumns = 3;


export default function TimelineScreen({ navigation }) {

	const { navigate } = navigation;
	const [artefacts, setArtefacts] = useState([]);

	const formatTime = (timeData) => {

		// TIMELINE FORMAT
		// Format date DD-MM-YYYY
		timeData.forEach(entry => {entry.time = Moment(entry.date).format("DD-MM-YYYY")});

		// Display only one date under several artefacts with the same date
		for (let i = timeData.length - 1; i > 0; i--) {
			if (timeData[i].time === timeData[i-1].time) {
				timeData[i].time = '';
			} 
		}
		
		return timeData;
	}
	const formatData = (data,numColumns) => {

		// GALLERY FORMAT
		const numberOfFullRows = Math.floor(data.length / numColumns);
  
		let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
		while (
			numberOfElementsLastRow !== numColumns &&
			numberOfElementsLastRow !== 0
		) {
			// data.push({key: `blank-${numberOfElementsLastRow}`, empty: true });
			numberOfElementsLastRow++;
		}

		
		
		// for (let i = data.length - 1 -numberOfElementsLastRow; i > 0; i--) {
		// 	if(data[i].name === ""){
		// 		data[i].pop();
		// 	}
		// }
		
		

		return data;
	};


	  // Get all the artefact
	  useEffect(() => {
		async function fetchArtefacts() {
			try {
				const res = await axios.get('http://localhost:3000/artefact');
				setArtefacts(res.data);
				console.log(res.data)
			} catch (e) {
				console.error(e);
			}
		}
		fetchArtefacts();
	}, []);

	
	// Custom render event title and event description (Timeline)
	renderDetail = ({ item, index }) => {
		if (item.empty) {
			return <View style={[styles.item, styles.itemInvisible]} />;
		}
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					<TouchableOpacity onPress={() => navigate('ItemDetail',{artefactId: item._id})}>
						<Image source={{uri: item.file}} style={styles.image} />
					</TouchableOpacity>
					<Text style={[styles.itemTitle]}>{item.name}</Text>
				</View>
			</View>
		);
	};

	// Render Item invisible if it's just a placeholder for columns in the grid,
    // if not, render the picture for each grid (Gallery)
	renderItem = ({ item, index }) => {
		if(item.empty){
			return <View style={[styles.item,styles.itemInvisible]} />
		}
		return (
		<View style={styles.item}>
			<TouchableHighlight onPress={() => navigate('ItemDetail', {artefactId: item._id}) }>
				<Image
					style={styles.imageBox}
					source={{uri: item.file}}
				/>
			</TouchableHighlight>    
		</View>
		);
	}

	


	// Layout for Gallery tab
	const FirstRoute = () => (
		<>
		<FlatList
			data={formatData(artefacts, numColumns)}
			keyExtractor={(item, index) => item._id}
			renderItem={renderItem}
			numColumns={numColumns}
			style={styles.container}
		/>
		</>
	);

	//Layout for Timeline tab
	const SecondRoute = () => (
		<>			
			<Timeline
				style={styles.list}
				data={formatTime(artefacts)}
				circleSize={15}
				circleColor='#EC6268'
				lineColor='#e3e3e3'
				innerCircleType='dot'
				renderDetail={renderDetail}
				timeContainerStyle={{ minWidth: 72, marginLeft: 10 }}
				timeStyle={{color:'#2d2e33'}}
			/>
		</>
	  );


	const [tab,setTab] = useState({
		index: 0,
		routes: [
		  { key: 'first', title: 'Gallery' },
		  { key: 'second', title: 'Timeline' },
		],
	});

  

	return (
		<>

			<View style={styles.containers}>
				<Text style={styles.title}>Memories Left Behind</Text>
				<Text style={styles.artefactTitle}>Artefact</Text>
			</View>
			<TabView
				navigationState={tab}
				renderScene={SceneMap({
					first: FirstRoute,
					second: SecondRoute,
				})}
				onIndexChange={index => setTab({ ...tab,index })}
				initialLayout={{ width: Dimensions.get('window').width }}
      		/>
			
			
			{/* <LinearGradient colors={['#50D5B7','#067D68']} style={styles.container}>
				<Text  style={styles.title}>Timeline</Text>				
			</LinearGradient> */}
			{/* <View style={styles.container}>
				<Text style={styles.title}>Artefact</Text>
				<Text style={styles.timelineTitle}>Timeline</Text>
			</View>	
			
			<Timeline
				style={styles.list}
				data={formatData(artefacts)}
				circleSize={15}
				circleColor='#EC6268'
				lineColor='#e3e3e3'
				innerCircleType='dot'
				renderDetail={renderDetail}
				timeContainerStyle={{ minWidth: 72, marginLeft: 10 }}
				timeStyle={{color:'#2d2e33'}}
			/> */}
		</>
	);
}

const styles = StyleSheet.create({
	scene: {
		flex: 1,
	  },
	itemTitle: {
		fontSize: 15,
		paddingLeft: 5,
	},
	title: {
		fontSize: 20,
		marginLeft:10,
		// fontWeight:'bold',
		// textAlign: 'center',
		// backgroundColor: '#EC6268',
		// borderBottomLeftRadius:75,
		color:'#2d2e33',
		paddingTop:'8%'
	},
	containers:{
		// borderBottomLeftRadius:25,
		// borderBottomRightRadius:25,
        backgroundColor:'#f5f7fb',
	},
	artefactTitle:{
		fontSize: 30,
		marginLeft:10,
		fontWeight:'bold',
		paddingBottom:'8%',

	},
	image: {
		width: 75,
		height: 75,
		borderRadius: 10
	},
	list: {
		flex: 1,
		marginTop: 20,
		// backgroundColor: '#ebecf1',
	},
	container: {
        flex: 1,
        marginVertical: 20
    },
    header: {
      fontSize: 20,
      textAlign:'center',
      marginVertical:10
    },
    title:{
        fontSize: 20,
		marginLeft:10,
		color:'#2d2e33',
        paddingTop:'8%',
        
    },
    galleryTitle:{
		fontSize: 30,
		marginLeft:10,
		fontWeight:'bold',
        paddingBottom:'8%',
    },

    item: {
        //backgroundColor: '#4D243D',
        alignItems: 'flex-start',
        // justifyContent: 'center',
        flex: 1,
        // marginLeft:10,
        // marginRight:10,
        height: Dimensions.get('window').width / numColumns, // approximate a square
      },
      itemInvisible: {
        backgroundColor: 'transparent',
      },
      itemText: {
        color: '#fff',
      },
      imageBox:{
        height: Dimensions.get('window').width / numColumns, // approximate a square
        flex: 1,
        margin: 1,
        width: Dimensions.get('window').width / numColumns,
      }

});

TimelineScreen.navigationOptions = {
	title: 'Timeline'
};
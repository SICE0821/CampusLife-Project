import React, { useState, useEffect, useRef } from 'react';
import { useFocusEffect,  } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, TouchableWithoutFeedback, ScrollView,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconD from 'react-native-vector-icons/AntDesign';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import config from '../../config';
//import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

type PostData = {
    post_id: number,
    title: string,
    contents: string,
    date: string,
    view: number,
    like: number,
    name: string,
    user_title: string,
    department_check : boolean,
    inform_check : boolean
}
const trueZero:PostData[] = [];
const falseZero:PostData[] = []
const trueTrue:PostData[] = []; 
const trueFalse:PostData[] = []; 
const falseTrue:PostData[] = []; 
const falseFalse:PostData[] = []; 

const SearchPostScreen: React.FC = ({ route, navigation }: any) => {
    console.log("you are in SearchPostScreen")
    const { userdata } = route.params;
    const [searchtext, setsearchtext] = useState('');
    const [generalCommunityData, setgeneralCommunityData] = useState<PostData[]>([]);
    const [departmentCommunityData, setDepartmentCommunityPost] = useState<PostData[]>([]);
    const [schoolNoticeData, setSchoolNoticeData] = useState<PostData[]>([]);
    const [departmentNoticeData, setDepartmentNoticeData] = useState<PostData[]>([]);
    const [allPostData, setAllPostData] = useState<PostData[]>([]); 
    const [userData, setUserData] = useState<UserData>(userdata);

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [value, setValue] = useState('전체');
    const [value2, setValue2] = useState('전체');
    const [items, setItems] = useState([
        { label: '전체', value: '전체' },
        { label: '커뮤니티', value: '커뮤니티' },
        { label: '공지사항', value: '공지사항' }
    ]);
    const [items2, setItems2] = useState([
        { label: '전체', value: '전체' },
        { label: '학교', value: '학교' },
        { label: '학과', value: '학과' }
    ]);

    const handlesearchTextChange = (inputText: string) => {
        setsearchtext(inputText);
    }

    const view_count_up = async (post_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/view_count_up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post_id
                })
            })
            const result = await response.json();
            //console.log("포스트 View 올리기 성공!")
        } catch (error) {
            console.error('포스트 View 올리기 누르기 실패', error);
        }
    }

    const FilterData = () => {
        if(value == "전체" && value2 == "전체") {
            return allPostData
        }else if(value == "커뮤니티" && value2 == "학교") {
            return generalCommunityData
        }else if (value == "커뮤니티" && value2 == "학과") {
            return departmentCommunityData
        }else if (value == "공지사항" && value2 == "학교") {
            return schoolNoticeData
        }else if (value == "공지사항" && value2 == "학과") {
            return departmentNoticeData
        }
    }

    useEffect(() => {
        if (value2 == "전체") {
            setValue("전체");
            setItems([
                {label: '전체', value: '전체' },
              ]);
        }else if(value2 == "학교") {
            setValue("커뮤니티");
            setItems([
                {label: '커뮤니티', value: '커뮤니티'},
                {label: '공지사항', value: '공지사항'}
              ]);
        }else if(value2 == "학과") {
            setValue("커뮤니티");
            setItems([
                {label: '커뮤니티', value: '커뮤니티'},
                {label: '공지사항', value: '공지사항'}
              ]);
        }
      }, [value2]);

    const getGeneralposts = async () => {
        try {
            //console.log('Search text:', searchtext);
            const response = await fetch(`${config.serverUrl}/search_post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search_text: searchtext
                }),
            });

            // Check if response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const postsdata:PostData[] = await response.json();
            postsdata.forEach(item=> {
                if (item.department_check && item.inform_check) {
                  trueTrue.push(item); //학과 공지사항
                } else if (item.department_check && !item.inform_check) {
                  trueFalse.push(item); //학과 게시판
                } else if (!item.department_check && item.inform_check) {
                  falseTrue.push(item);  //학교 공지사항
                } else {
                  falseFalse.push(item); //전체 게시판
                }
              });
              setDepartmentNoticeData(trueTrue);
              setDepartmentCommunityPost(trueFalse);
              setAllPostData(postsdata);
              setSchoolNoticeData(falseTrue);
              setgeneralCommunityData(falseFalse);
            // setCommunityData(postsdata);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const renderItem = ({ item, index }: { item: PostData, index: number }) => (
        <TouchableWithoutFeedback onPress={async () => {
            await view_count_up(item.post_id);
            navigation.navigate("PostDetailScreen", { item, userData })
        }}>
            <View style={styles.writeboxcontainer}>
                <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                        <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.title}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                        <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                        <Text style={{ color: 'black', marginLeft: 3 }}>{item.view}</Text>
                    </View>
                </View>
                <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                        <Text
                            style={{
                                fontSize: 13,
                                marginLeft: 10,
                                color:
                                    item.user_title === "학교" ? 'red' :
                                        item.user_title === "반장" ? 'green' :
                                            item.user_title === "학우회장" ? 'blue' :
                                                'black'
                            }}
                        >
                            {item.name}
                        </Text>
                        <Text> | {item.date}</Text>
                    </View>
                    <View style={styles.likenum}>
                        <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                        <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    //console.log(communityData);

    return (
        <View style={styles.container}>
            <View style={styles.emptyspace1}></View>
            <View style={styles.headercontainer}>

                <View style={styles.searchcontainer}>
                    <View style={styles.picturebox}>
                        <IconD name="search1" size={22} color="#979797" />
                    </View>
                    <View style={styles.textinputbox}>
                        <TextInput
                            style={{ flex: 1, fontSize: 16, color: 'black' }}
                            onChangeText={handlesearchTextChange}
                            value={searchtext}
                            placeholder="글 제목, 내용"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={async () => {
                                await getGeneralposts()
                            }}
                        />
                    </View>
                </View>
                <View style={styles.cancelcontainer}>
                    <TouchableOpacity style={styles.cancelbox} onPress={() => navigation.navigate("CommunityScreenStackNavigator")}>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            취소
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.listcontainer}>
                <View>
                    <DropDownPicker
                        open={open}
                        value={value2}
                        items={items2}
                        setOpen={setOpen}
                        setValue={setValue2}
                        setItems={setItems2}
                        containerStyle={{ width: 130, backgroundColor : 'white', zIndex: 1000 }}
                        dropDownContainerStyle={styles.dropdown}
                        style={styles.dropdownStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                    />
                </View>
                <View style={{marginLeft: 10 , backgroundColor : 'red'}}>
                    <DropDownPicker
                        open={open2}
                        value={value}
                        items={items}
                        setOpen={setOpen2}
                        setValue={setValue}
                        setItems={setItems}
                        containerStyle={{ width: 130, backgroundColor : 'white', zIndex: 1000 }}
                        dropDownContainerStyle={styles.dropdown}
                        style={styles.dropdownStyle}
                        labelStyle={styles.labelStyle}
                        placeholder="Select an option"
                        placeholderStyle={styles.placeholderStyle}
                    />
                </View>
            </View>
            {allPostData.length === 0 ? (
                <View style={styles.nosearchView}>
                    <IconD name="search1" size={100} color="#979797" />
                    <Text style={{ fontSize: 20, marginTop: 10, fontWeight: 'bold' }}>게시판의 글을 검색해보세요</Text>
                </View>
            ) : (
                <View>
                <FlatList
                    data={FilterData()}
                    renderItem={renderItem}
                    style={{ zIndex: -1 }}
                />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    emptyspace1: {
        height: 20,
        //backgroundColor: 'blue',
    },
    headercontainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchcontainer: {
        height: 40,
        width: 320,
        backgroundColor: '#FFDECF',
        flexDirection: 'row',
        marginLeft: 8,
        borderRadius: 8,
        //borderWidth: 1,
    },
    cancelcontainer: {
        height: 40,
        width: 80,
        //backgroundColor : 'green'
    },
    picturebox: {
        height: 40,
        marginLeft: 10,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textinputbox: {
        height: 42
    },
    cancelbox: {
        flex: 1,
        backgroundColor: '#9A9EFF',
        borderRadius: 8,
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topnavigationborder: {
        flex: 1,
        //backgroundColor : "blue",
        borderWidth: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 57,
    },

    flatlisttopline: {
        //backgroundColor : 'red',
        //right : 118,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC'
    },

    flatliststyle: {
        //marginTop : 40,
        //backgroundColor : 'blue',
    },

    writeboxcontainer: {
        //padding: 50, 
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        //backgroundColor: 'red',
        height: 70,
    },

    writetitle: {
        flex: 0.6,
        flexDirection: 'row',
        marginTop: 5,
        //backgroundColor : 'yellow'
    },

    wirterandtime: {
        flex: 0.4,
        flexDirection: 'row'
        //backgroundColor : 'yellow'
    },

    titlebox: {
        flex: 0.85,
        //backgroundColor : 'green'
    },
    eyesnum: {
        flex: 0.15,
        flexDirection: 'row',
        // backgroundColor : 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    writerbox: {
        flex: 0.85,
        flexDirection: 'row',
        //backgroundColor : 'yellow',
    },
    likenum: {
        flex: 0.15,
        flexDirection: 'row',
        //backgroundColor : 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    delete: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
    },

    nosearchView: {
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },

    listcontainer: {
        height: 60,
        flexDirection: 'row',  // 가로로 배치
        alignItems: 'center',  // 수직 정렬
        padding: 10,
    },
    dropdownStyle: {
        backgroundColor: 'white',  // 선택된 옵션의 배경색
        borderColor: '#cccccc',  // 기본 테두리 색상
        borderRadius: 10,  // 모서리를 둥글게
        height: 50,  // 높이 설정
        paddingHorizontal: 10,  // 텍스트와 테두리 사이 간격
        borderWidth :2
      },
      labelStyle: {
        fontSize: 14,  // 폰트 크기 설정
        color: 'black',  // 글자 색상
        fontWeight : 'bold'
      },
      arrowIcon: {
        tintColor: '#888',  // 화살표 색상
      },
      dropdown: {
        backgroundColor: '#ffffff',  // 드롭다운 리스트의 배경색
        borderColor: '#cccccc',  // 테두리 색상
        borderRadius: 10,  // 모서리 둥글게
        borderLeftWidth : 2,
        borderRightWidth : 2,
        borderBottomWidth : 2
      },
      placeholderStyle: {
        fontSize: 14,  // 플레이스홀더 폰트 크기
        color: 'black',  // 플레이스홀더 색상
      },
}
)

export default SearchPostScreen;
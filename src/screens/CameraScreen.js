import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { recognizeFoodFromPhoto } from '../utils/aiRecognition';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [analyzing, setAnalyzing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.center}><ActivityIndicator /></View>;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.permissionText}>需要相機權限才能拍攝食物照片</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>允許使用相機</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  async function handleAnalyze(uri) {
    setAnalyzing(true);
    try {
      const result = await recognizeFoodFromPhoto(uri);
      navigation.replace('Result', { photoUri: uri, recognition: result });
    } catch (e) {
      console.warn('辨識失敗', e);
      setAnalyzing(false);
    }
  }

  async function takePhoto() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.6 });
    handleAnalyze(photo.uri);
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      handleAnalyze(result.assets[0].uri);
    }
  }

  if (analyzing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.analyzingText}>正在辨識食物…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <View style={styles.controls}>
        <TouchableOpacity style={styles.libraryBtn} onPress={pickFromLibrary}>
          <Text style={styles.libraryBtnText}>相簿</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shutterBtn} onPress={takePhoto} />
        <View style={{ width: 60 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  shutterBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#ccc',
  },
  libraryBtn: { width: 60, alignItems: 'center' },
  libraryBtnText: { color: '#fff', fontSize: 14 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { textAlign: 'center', marginBottom: 16, fontSize: 15, color: '#333' },
  permissionBtn: { backgroundColor: '#2ecc71', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  permissionBtnText: { color: '#fff', fontWeight: '600' },
  analyzingText: { marginTop: 12, color: '#666' },
});

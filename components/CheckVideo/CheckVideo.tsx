import React from 'react';
import {
    View,
    Button,
    StyleSheet
} from 'react-native';
import RNCamera from 'react-native-camera-ios';
 
const styles = StyleSheet.create({
    overlayRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 80,
        alignItems: 'center'
    }
});
class CameraModal extends React.Component {
    onCapture({ image }) {
        // Fields available:
        // `image.path`, `image.width`, `image.height`
 
        this.props.onCapture(image.path);
    }
    render() {
        return (
            <RNCamera
                ref={(r) => this.camera = r}
                {...this.props}
                onCapture={(event) => this.onCapture(event)}
            >
                <View
                    style={styles.overlayRight}
                >
                    <Button
                        onPress={() => this.camera.capture()}
                        color="white"
                        title="Capture"
                    />
                </View>
            </RNCamera>
        );
    }
}
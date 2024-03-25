import { View, Text, Modal, Image, Button } from "react-native";

export default function PopUp({ props }) {
    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => {
            props.set(null);
          }}
        >
          <View className="flex justify-center items-center h-full">
            <View className="flex bg-orange-50 p-6 w-5/6 rounded-xl items-center justify-center border-4 border-orange-300">
              <Text className="text-3xl font-semibold">{props.name}</Text>
              <Image className="w-full h-2/6 rounded-full my-6" resizeMode="contain" source={props.image} />                      
              <Text className="text-base mb-6 text-center">{props.info}</Text>
              <Button 
                title="Sulje"
                color="#ff150d"
                onPress={() => props.set(null)}
              />
            </View>
          </View>
        </Modal>
    );
}
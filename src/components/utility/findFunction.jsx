export const objectName = (array, value) => {
    const object = array?.find((item) => item.id == value);
    if (object) {
        return object?.name;
    } else {
        // Handle the case where the object is not found, e.g., return a default value
        return value; // Or any default value as per your requirement
    }
};
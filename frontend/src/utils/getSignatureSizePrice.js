export const calculateSignatureSizePrice = (csUnits, size) => {
    switch (size) {
        case "small":
            return csUnits[0]
        case "medium":
            return csUnits[1]
        case "large":
            return csUnits[2]
        default:
            return 100
    }
}
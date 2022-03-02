const types = ["C", "I"];

const directions = ["R", "C"];
const x_directions = ["S", "E", "C", "B", "A"];
const y_directions = ["S", "E", "C", "X"];

const allCombination = types.flatMap(type => {
    return directions.flatMap(direction => {
        return x_directions.flatMap(x => {
            return y_directions.flatMap(y => {
                const temp = {
                    name: `${type}${direction}${x}${y}`,
                    value: {
                        justifyContent: x === "S" ? "flex-start" : x === "E" ? "flex-end" : x === "C" ? "center" : x === "B" ? "space-between" : x === "A" ? "space-around" : "",
                        alignItems: y === "S" ? "flex-start" : y === "E" ? "flex-end" : y === "C" ? "center" : y === "X" ? "stretch" : "",
                    }
                };
                if (type === "C") {
                    temp.value.direction = direction === "R" ? "row" : "column";
                } else {
                    temp.value.display = "flex";
                    temp.value.flexDirection = direction === "R" ? "row" : "column";
                }
                return temp;
            });
        });
    });
});

let exportObj = {};

allCombination.forEach(item => {
    exportObj[`G${item.name}`] = item.value;
})

export default exportObj;

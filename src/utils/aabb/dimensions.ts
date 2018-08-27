export type Dimensions = {
    width: number;
    height: number;
};

export type Coordinates = {
    x: number;
    y: number;
};

export type FullDimensions = Dimensions & Coordinates;

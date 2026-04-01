import mongoose, { Schema } from "mongoose";

const baseOptions = { timestamps: true };

const OfficeAssetSchema = new Schema({
    assetId: { type: String, required: true },
    vendor: String,
    location: String,
    quantity: { type: Number, default: 1 },
    dateOfPurchase: String,
    status: { type: String, default: "Active" },
    remarks: String,
}, baseOptions);

const createOfficeModel = (name: string) => mongoose.models[name] || mongoose.model(name, OfficeAssetSchema);

export const Desk = createOfficeModel("Office_Desk");
export const Lights = createOfficeModel("Office_Lights");
export const Chairs = createOfficeModel("Office_Chairs");
export const AC = createOfficeModel("Office_AC");
export const ROFacility = createOfficeModel("Office_ROFacility");
export const Sofa = createOfficeModel("Office_Sofa");
export const UPSBattery = createOfficeModel("Office_UPSBattery");
export const FireExtinguisher = createOfficeModel("Office_FireExtinguisher");
export const Vehicles = createOfficeModel("Office_Vehicles");
export const MobileChargers = createOfficeModel("Office_MobileChargers");
export const Racks = createOfficeModel("Office_Racks");
export const Cupboards = createOfficeModel("Office_Cupboards");
export const Umbrella = createOfficeModel("Office_Umbrella");
export const Devotional = createOfficeModel("Office_Devotional");
export const CleaningAccessories = createOfficeModel("Office_CleaningAccessories");
export const Others = createOfficeModel("Office_Others");

// Guest House Assets
export const GuestHouseBed = createOfficeModel("GuestHouse_Bed");
export const GuestHouseWardrobe = createOfficeModel("GuestHouse_Wardrobe");
export const GuestHouseTV = createOfficeModel("GuestHouse_TV");
export const GuestHouseFridge = createOfficeModel("GuestHouse_Fridge");
export const GuestHouseGeyser = createOfficeModel("GuestHouse_Geyser");
export const GuestHouseAirCooler = createOfficeModel("GuestHouse_AirCooler");
export const GuestHousePillows = createOfficeModel("GuestHouse_Pillows");
export const GuestHouseBedSheet = createOfficeModel("GuestHouse_BedSheet");
export const GuestHouseBedCover = createOfficeModel("GuestHouse_BedCover");
export const GuestHousePlasticRack = createOfficeModel("GuestHouse_PlasticRack");
export const GuestHouseFan = createOfficeModel("GuestHouse_Fan");
export const GuestHouseGlassTumbler = createOfficeModel("GuestHouse_GlassTumbler");
export const GuestHouseOthers = createOfficeModel("GuestHouse_GuestHouseOthers");


export const OfficeModelMap: Record<string, mongoose.Model<unknown>> = {
    desk: Desk,
    lights: Lights,
    chairs: Chairs,
    ac: AC,
    "ro facility": ROFacility,
    sofa: Sofa,
    "ups and battery": UPSBattery,
    fireextinguisher: FireExtinguisher,
    vehicles: Vehicles,
    "mobile chargers": MobileChargers,
    racks: Racks,
    cupboards: Cupboards,
    umbrella: Umbrella,
    devotional: Devotional,
    "cleaning accessories": CleaningAccessories,
    others: Others,
    // Guest House
    bed: GuestHouseBed,
    wardrobe: GuestHouseWardrobe,
    television: GuestHouseTV,
    refrigerator: GuestHouseFridge,
    geyser: GuestHouseGeyser,
    // New items from user request
    "air cooler": GuestHouseAirCooler,
    pillows: GuestHousePillows,
    "bed sheet": GuestHouseBedSheet,
    "bed cover": GuestHouseBedCover,
    "plastic rack": GuestHousePlasticRack,
    fan: GuestHouseFan,
    "glass tumbler": GuestHouseGlassTumbler,
    "guest house others": GuestHouseOthers
};


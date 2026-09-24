var currentJiggy = ``;
var currentImage = ``;
var jiggyPieceSize = 10;

var randomJiggyArrayMeat = [
    "fashionista/bath1",
    "fashionista/dot1",
    "fashionista/fishing",
    "fashionista/gathering",
    "fashionista/hunting",
    "fashionista/intro",
    "fashionista/logbook2",
    "fashionista/logbook3",
    "fashionista/logbook4",
    "fashionista/magazine1-0",
    "fashionista/magazine1-1",
    "fashionista/magazine1-2",
    "fashionista/magazine1-3",
    "fashionista/magazine1-4",
    "fashionista/magazine1",
    "fashionista/morning1-1",
    "fashionista/morning1-2",
    "fashionista/morning1-3",
    "fashionista/morning1-4",
    "fashionista/morning1-5",
    "fashionista/morning1-6",
    "fashionista/morning1-7",
    "fashionista/nightmare",
    "fashionista/pills1-1-light",
    "fashionista/pills1-2-light",
    "fashionista/pills1-5-light",
    "fashionista/repeat1-1",
    "fashionista/repeat1-2",
    "fashionista/repeat1-3",
    "fashionista/repeat1-4",
    "fashionista/repeat1-5",
    "fashionista/repeat1-6",
    "fashionista/repeat2-1",
    "fashionista/repeat2-2",
    "fashionista/repeat2-3",
    "fashionista/repeatLong-0",
    "fashionista/repeatLong-1",
    "fashionista/repeatLong-2",
    "fashionista/repeatLong-3",
    "fashionista/repeatLong-4",
    "fashionista/repeatLong-5",
    "fashionista/repeatLong-6",
    "fashionista/repeatLong-7",
    "fashionista/repeatPonytail-0",
    "fashionista/repeatPonytail-1",
    "fashionista/repeatPonytail-2",
    "fashionista/repeatPonytail-3",
    "fashionista/repeatPonytail-4-masc-light",
    "fashionista/repeatPonytail-5",
    "fashionista/repeatPonytail-6-masc-light",
    "fashionista/repeatPonytail-7",
    "fashionista/repeatPonytail-8",
    "fashionista/repeatPonytail-9",
    "fashionista/repeatTwintail-1",
    "fashionista/repeatTwintail-2",
    "fashionista/repeatTwintail-3",
    "fashionista/repeatTwintail-4",
    "fashionista/repeatTwintail-5",
    "fashionista/repeatTwintail-6",
    "fashionista/repeatTwintail-7",
    "fashionista/repeatTwintail-8",
    "fashionista/styleIntro-1",
    "fashionista/styleIntro-2",
    "fashionista/tease1-1",
    "fashionista/tease1-2",
    "fashionista/tease1-3",
    "fashionista/tease2-1",
    "fashionista/tease2-2",
    "fashionista/tease2-3",
    "fashionista/tease2-4",
    "fashionista/tease2-5",
    "fashionista/tease3a-1",
    "fashionista/tease3a-2",
    "fashionista/tease3a-3",
    "fashionista/tease3b-1",
    "fashionista/tease3b-2",
    "fashionista/tease3b-3",
    "fashionista/tease3c-1",
    "fashionista/tease3c-2",
    "fashionista/tease3d-1",
    "fashionista/tease3d-2",
    "fashionista/tease3d-3",
    "fashionista/tease4-1",
    "fashionista/tease4-2",
    "fashionista/tease4-3",
    "fashionista/tease4-4",
    "fashionista/tease4-5",
    "fashionista/tease4-6",
    "fashionista/tease4-7rosebud",
    "fashionista/tease4Intro-1",
    "fashionista/tease4Intro-2",
    "fashionista/tease4Intro-3",
    "fashionista/tease5-0",
    "fashionista/tease5-1",
    "fashionista/tease5-10",
    "fashionista/tease5-11rosebud",
    "fashionista/tease5-2",
    "fashionista/tease5-3",
    "fashionista/tease5-4",
    "fashionista/tease5-5",
    "fashionista/tease5-6",
    "fashionista/tease5-7",
    "fashionista/tease5-8",
    "fashionista/tease5-9",
    "fashionista/wallFront-04",
    "fashionista/wallRear-01",
    "fashionista/wallRear-02",
    "fashionista/wallRear-03",
    "fashionista/wallRear-04",
    "fashionista/wallRear-05",
    "fashionista/wallRear-06",
    "fashionista/wallRear-07",
    "fashionista/wallRear-08",
    "fashionista/wallRear-09",
    "fashionista/wallRear-10Rosebud",
    "foxf/bath1",
    "foxm/fishing",
    "foxm/fun-foxm1",
    "foxm/fun-foxm2",
    "foxm/fun-foxm3",
    "foxm/fun-foxm4",
    "foxm/fun-foxm5",
    "foxm/gathering",
    "foxm/hot1",
    "foxm/hunting",
    "foxm/logbook2",
    "foxm/logbook3",
    "foxm/logbook4",
    "foxm/magazine1-0",
    "foxm/magazine1-1",
    "foxm/magazine1-2",
    "foxm/magazine1-3",
    "foxm/magazine1-4",
    "foxm/magazine1",
    "foxm/mystery-foxm1",
    "foxm/mystery-foxm2",
    "foxm/mystery-foxm3",
    "foxm/mystery-foxm4",
    "foxm/mystery-foxm5",
    "foxm/repeat1-1",
    "foxm/repeat1-2a",
    "foxm/repeat1-2b",
    "foxm/repeat1-3a",
    "foxm/reward1M-1",
    "foxm/reward1M-2",
    "foxm/reward1M-3",
    "foxm/reward1M-4",
    "foxm/reward1M-5",
    "foxm/reward1M-6",
    "foxm/reward1M-7",
    "foxm/reward1M-8",
    "foxm/reward2-1",
    "foxm/reward2-2",
    "foxm/reward2-3",
    "foxm/reward2-4",
    "foxm/reward2-5",
    "foxm/reward2-6rosebud",
    "hyena/bath1",
    "hyena/fishing",
    "hyena/gathering",
    "hyena/hot1",
    "hyena/hunting",
    "hyena/hyena1-1",
    "hyena/hyena1-2",
    "hyena/hyena1-3",
    "hyena/hyena1-4",
    "hyena/hyena2-2-light",
    "hyena/hyena2-3",
    "hyena/hyena2-4",
    "hyena/hyena3-1",
    "hyena/hyena3-2",
    "hyena/hyena3-3",
    "hyena/hyena3-3a",
    "hyena/hyena3-3b",
    "hyena/hyena3-4",
    "hyena/hyena3-4a",
    "hyena/hyena3-4b",
    "hyena/hyena4-1",
    "hyena/hyena4-2",
    "hyena/hyena4-3",
    "hyena/hyena4-4",
    "hyena/hyena4-5",
    "hyena/hyena4-6",
    "hyena/hyena4-8",
    "hyena/hyena4-9a",
    "hyena/hyena4-9b",
    "hyena/hyena5-1",
    "hyena/hyena5-2",
    "hyena/hyena5-3",
    "hyena/hyena6-1",
    "hyena/hyena6-2",
    "hyena/hyena6-3",
    "hyena/hyena6-4",
    "hyena/hyena6-5",
    "hyena/hyena6-6",
    "hyena/intro",
    "hyena/logbook2",
    "hyena/logbook3",
    "hyena/logbook4",
    "hyena/magazine1-1",
    "hyena/magazine1-2",
    "hyena/magazine1-3",
    "hyena/magazine1-4",
    "hyena/magazine1",
    "hyena/morning1-1",
    "hyena/morning1-2",
    "hyena/nudity1-1",
    "hyena/nudity1-2",
    "hyena/poster",
    "hyena/repeat1-1",
    "hyena/repeat1-2",
    "hyena/repeat1-3",
    "hyena/repeat1-4",
    "hyena/repeat2-1",
    "hyena/repeat2-2",
    "hyena/repeat2-3",
    "hyena/repeatHand-1",
    "hyena/repeatHand-2",
    "hyena/repeatHand-3",
    "hyena/repeatHand-4",
    "hyena/repeatHand-5",
    "hyena/repeatHand-6",
    "hyena/repeatRimming-1",
    "hyena/repeatRimming-2",
    "hyena/repeatRimming-3",
    "hyena/repeatRimming-4",
    "hyena/repeatRimming-5",
    "hyena/repeatRimming-6",
    "hyena/repeatThighfuck-1-light",
    "hyena/repeatThighfuck-2-light",
    "hyena/repeatThighfuck-3-light",
    "hyena/repeatThighfuck-4-light",
    "hyena/repeatThighfuck-5-light",
    "hyena/repeatThighfuck-6-light",
    "hyena/tourCarpenter",
    "hyena/tourFishing",
    "hyena/tourGathering",
    "hyena/tourHunting",
    "hyena/tourMayor",
    "mesu/bath1",
    "mesu/cherry1-1-light",
    "mesu/cherry1-2",
    "mesu/cherry1-3-light",
    "mesu/cherry1-4-light",
    "mesu/cherry1-5-light",
    "mesu/cherry1-6",
    "mesu/fishing",
    "mesu/gathering",
    "mesu/hot1",
    "mesu/house-1",
    "mesu/house-2",
    "mesu/house-3",
    "mesu/hunting",
    "mesu/intro1",
    "mesu/intro2",
    "mesu/logbook2",
    "mesu/logbook3",
    "mesu/logbook4",
    "mesu/magazine1-0",
    "mesu/magazine1-1",
    "mesu/magazine1-2",
    "mesu/magazine1-3",
    "mesu/magazine1-4",
    "mesu/magazine1",
    "mesu/mesu1-1",
    "mesu/mesu2-2",
    "mesu/mesu2-3",
    "mesu/mesu4-1",
    "mesu/mesu4a-1",
    "mesu/mesu4a-2",
    "mesu/mesu4a-3",
    "mesu/mesu4b-1",
    "mesu/mesu4b-2",
    "mesu/mesu4b-3",
    "mesu/mesu4b-4",
    "mesu/mesu4c-1",
    "mesu/mesu4c-2",
    "mesu/mesu4c-3",
    "mesu/mesu4F",
    "mesu/mesu6-2",
    "mesu/mesu6-3",
    "mesu/mesu6-4",
    "mesu/mesu6-5",
    "mesu/mesu6-6",
    "mesu/mesu6-7",
    "mesu/mesu6-8",
    "mesu/mesu6-9",
    "mesu/mesu6-9Rosebud",
    "mesu/mesu6-F",
    "mesu/mesu6-FRosebud",
    "mesu/mesu6Start-0",
    "mesu/mesu6Start-1",
    "mesu/mesu6Start-2",
    "mesu/mesu6Start-3",
    "mesu/morningSilly1-1",
    "mesu/pills1-1",
    "mesu/pills1-2",
    "mesu/pills1-3",
    "mesu/pills1-3a",
    "mesu/pills1-3b",
    "mesu/pills1-4",
    "mesu/pills1-5",
    "mesu/pills1-6",
    "mesu/pills1-7",
    "mesu/pills1-8",
    "mesu/repeat1-1",
    "mesu/repeat1-2",
    "mesu/repeat1-3",
    "mesu/repeat1-4",
    "mesu/repeat1-5",
    "mesu/repeat1-6",
    "mesu/repeat1-7",
    "mesu/repeat2-1",
    "mesu/repeat2-2",
    "mesu/repeat2-3",
    "mesu/wall1-1",
    "mesu/wall1-2",
    "mesu/wall1-3",
    "mesu/wall1-4",
    "mesu/wall1-5",
    "mesu/wall1-6",
    "mesu/wall1-7",
    "mesu/wall1-8a",
    "mesu/wall1-8b",
    "mesu/wall1-9",
    "mesu/wall1-fa",
    "mesu/wall1-fb",
    "carpenter/bandit1-1",
    "carpenter/bandit1-2",
    "carpenter/bandit2-1",
    "carpenter/bandit2-2",
    "carpenter/bandit2-3Meat",
    "carpenter/bandit3-1",
    "carpenter/bandit3-2",
    "carpenter/bandit3-3",
    "carpenter/bandit4-2",
    "carpenter/bandit4-3-light",
    "carpenter/bandit4-4Meat",
    "carpenter/bandit4-5-light",
    "carpenter/bandit4-6-light",
    "carpenter/bandit4-7Meat",
    "carpenter/bandit5-1",
    "carpenter/bandit5-2Meat",
    "carpenter/bandit5-3Meat",
    "carpenter/bandit5-4-light",
    "carpenter/bandit5-5-light",
    "carpenter/bandit5-6-light",
    "carpenter/bath1",
    "carpenter/carpenterSnooze1-1",
    "carpenter/carpenterSnooze1-2",
    "carpenter/carpenterSnooze1-3",
    "carpenter/carpenterSnooze1-4",
    "carpenter/carpenterSnooze1-5",
    "carpenter/carpenterSnooze1-6",
    "carpenter/carpenterSnooze2Meat-1",
    "carpenter/carpenterSnooze2Meat-2",
    "carpenter/carpenterSnooze2Meat-3",
    "carpenter/carpenterSnooze2Meat-5",
    "carpenter/carpenterSnooze2Meat-6",
    "carpenter/carpenterSnooze2Meat-7",
    "carpenter/fishingMeat",
    "carpenter/gatheringMeat",
    "carpenter/hot1Meat",
    "carpenter/huntingMeat",
    "carpenter/logbook2m",
    "carpenter/logbook3m",
    "carpenter/logbook4m",
    "carpenter/magazine1Meat-0",
    "carpenter/magazine1Meat-1",
    "carpenter/magazine1Meat-2",
    "carpenter/magazine1Meat-3",
    "carpenter/magazine1Meat-4",
    "carpenter/magazine1Meat",
    "carpenter/morningSilly1-1",
    "carpenter/morningsSilly1-2",
    "carpenter/repeat1-1Meat",
    "carpenter/repeat1-2Meat",
    "carpenter/repeat1-3Meat",
    "carpenter/wallFront-1",
    "carpenter/wallFront-2",
    "carpenter/wallFront-3",
    "carpenter/wallFront-4",
    "carpenter/wallRearMeat-01",
    "carpenter/wallRearMeat-02",
    "carpenter/wallRearMeat-03",
    "carpenter/wallRearMeat-04",
    "carpenter/wallRearMeat-05",
    "carpenter/wallRearMeat-07",
    "carpenter/wallRearMeat-09",
    "carpenter/wallRearMeat-10",
    "carpenter/wallRearMeat-11",
    "carpenter/wallRearMeat-11Rosebud",
    "carpenter/wallRearMeat-12",
    "mayor/bath1Meat",
    "mayor/gatheringMeat",
    "mayor/horny2-1",
    "mayor/horny2-2",
    "mayor/horny3Meat-1",
    "mayor/horny3Meat-2",
    "mayor/horny3Meat-3",
    "mayor/horny3Meat-4",
    "mayor/horny4Meat-1",
    "mayor/horny4Meat-2",
    "mayor/horny4Meat-3",
    "mayor/horny5",
    "mayor/hot1",
    "mayor/huntingMeat",
    "mayor/intro2",
    "mayor/logbook2m",
    "mayor/logbook3m",
    "mayor/logbook4m",
    "mayor/magazine1Meat-1",
    "mayor/magazine1Meat-2",
    "mayor/magazine1Meat-3",
    "mayor/magazine1Meat-4",
    "mayor/magazine1Meat",
    "mayor/mayorMorning-2Meat-1",
    "mayor/mayorMorning-2Meat-2",
    "mayor/mayorMorning-5Meat-1",
    "mayor/mayorMorning-5Meat-2",
    "mayor/mayorMorning-5Meat-3",
    "mayor/mayorMorning-5Meat-4",
    "mayor/mayorMorning8Meat",
    "mayor/mayorMorning9Meat-1",
    "mayor/mayorMorning9Meat-2",
    "mayor/morningSilly1-1",
    "mayor/nightmareMeat",
    "mayor/nudity1-1-light-masc",
    "mayor/nudity1-2Meat",
    "mayor/nudity1-4-light-masc",
    "mayor/pounceMeat-1",
    "mayor/pounceMeat-2",
    "mayor/pounceMeat-3",
    "mayor/pounceMeat-4",
    "mayor/pounceMeat-5",
    "mayor/pounceMeat-6",
    "mayor/pounceMeat-6rosebud",
    "mayor/pounceMeat-7",
    "mayor/repeat1",
    "mayor/repeat2-1",
    "mayor/repeat2-2",
    "mayor/repeat2-3",
    "mayor/repeat2",
    "mayor/repeat3",
    "mayor/repeat4",
    "mayor/repeat5Meat",
    "mayor/repeat6",
    "mayor/safe1",
    "mayor/wall-01",
    "mayor/wall-02",
    "mayor/wall-03Meat",
    "mayor/wall-04",
    "mayor/wall-05",
    "mayor/wall-06",
    "mayor/wall-07Meat",
    "mayor/wall-08",
    "mayor/wall-09",
    "mayor/wall-10",
    "shopkeep/bath1Meat",
    "shopkeep/fishingMeat",
    "shopkeep/gatheringMeat",
    "shopkeep/hole00",
    "shopkeep/hole01Meat",
    "shopkeep/hole02",
    "shopkeep/hole03Meat",
    "shopkeep/hole04Meat",
    "shopkeep/hole05Meat",
    "shopkeep/hole06",
    "shopkeep/hole07",
    "shopkeep/hole08Meat",
    "shopkeep/hole09Meat",
    "shopkeep/hole10",
    "shopkeep/hole11Meat",
    "shopkeep/hole11Veggie",
    "shopkeep/hot1Meat",
    "shopkeep/huntingMeat",
    "shopkeep/introC",
    "shopkeep/logbook2m",
    "shopkeep/logbook3m",
    "shopkeep/logbook4m",
    "shopkeep/magazine1Meat-0",
    "shopkeep/magazine1Meat-1",
    "shopkeep/magazine1Meat-2",
    "shopkeep/magazine1Meat-3",
    "shopkeep/magazine1Meat-4",
    "shopkeep/magazine1Meat",
    "shopkeep/nightmareMeat",
    "shopkeep/pet1-1",
    "shopkeep/pet1-2-light",
    "shopkeep/pet1-3-light",
    "shopkeep/pet2-1",
    "shopkeep/pet2-2-light",
    "shopkeep/pet2-3Meat",
    "shopkeep/pet2-4",
    "shopkeep/pet3-1",
    "shopkeep/pet3-2-light",
    "shopkeep/pet3-3Meat",
    "shopkeep/pet3-4Meat-light",
    "shopkeep/pet3-4Veggie-light",
    "shopkeep/pet3-5Meat-light",
    "shopkeep/pet3-5Veggie-light",
    "shopkeep/pill1Meat",
    "shopkeep/pill2",
    "shopkeep/pill3",
    "shopkeep/pill4",
    "shopkeep/pill5",
    "shopkeep/pill6",
    "shopkeep/pill7",
    "shopkeep/pill8Meat",
    "shopkeep/pill9Meat",
    "shopkeep/reward1Meat-1",
    "shopkeep/reward1Meat-2",
    "shopkeep/reward1Meat-3",
    "shopkeep/reward1Meat-4",
    "shopkeep/reward1Meat-5",
    "shopkeep/reward2Meat-1",
    "shopkeep/reward2Meat-2",
    "shopkeep/reward2Meat-4",
    "shopkeep/reward2Meat-5",
    "shopkeep/reward2Meat-6",
    "shopkeep/reward2Meat-7",
    "shopkeep/reward3Meat-1",
    "shopkeep/reward3Meat-2",
    "shopkeep/reward3Meat-3",
    "shopkeep/reward3Meat-4",
    "shopkeep/reward3Meat-5",
    "shopkeep/reward3Meat-6",
    "shopkeep/reward3Meat-7rosebud",
    "shopkeep/wallFront-1",
    "shopkeep/wallFront-2",
    "shopkeep/wallFront-3",
    "shopkeep/wallFront-4",
    "shopkeep/wallFront-5",
    "shopkeep/wallRearMeat-01",
    "shopkeep/wallRearMeat-02",
    "shopkeep/wallRearMeat-03",
    "shopkeep/wallRearMeat-04",
    "shopkeep/wallRearMeat-05",
    "shopkeep/wallRearMeat-06",
    "shopkeep/wallRearMeat-07",
    "shopkeep/wallRearMeat-08",
    "shopkeep/watch0Meat",
    "shopkeep/watch1Meat",
    "shopkeep/watch2",
    "shopkeep/watch3Meat",
    "shopkeep/watch4",
    "shopkeep/watch5",
    "shopkeep/watch6Meat",
    "shopkeep/watch7Meat",
    "shopkeep/watch8Meat",
    "shopkeep/watch9Meat",
    "shopkeep/watchFMeat",
    "artifacts/pills3Meat",
    "artifacts/tv2",
    "artifacts/watch2",
    "artifacts/pill-fail1",
    "artifacts/pill-fail2",
    "artifacts/pill-fail3",
    "artifacts/pill-fail4",
    "artifacts/pill-fail5",
    "artifacts/pill-fail6",
    "artifacts/pill-fail1",
    "wolf/wolfMorning-carpenterMeat",
    "wolf/wolfMorning-doe",
    "wolf/wolfMorning-doe2",
    "wolf/wolfMorning-fash",
    "wolf/wolfMorning-hyena",
    "wolf/wolfMorning-hyenaAlt",
    "wolf/wolfMorning-mayorMeat",
    "wolf/wolfMorning-shopkeepMeat",
    "misc/fishingGoddess1Meat",
    "misc/fishingGoddess2Meat",
    "misc/fishingGoddess3Meat",
    "misc/fishingWishMeat",
    "misc/gatheringDryadMeat",
    "misc/gatheringMerchantMeat",
    "misc/gatheringMushroom1Meat",
    "misc/gatheringMushroom2Meat",
    "misc/huntingFairy1Meat",
    "misc/huntingMaestroMeat",
    "misc/grotto/forestJuice1-1-light",
    "misc/grotto/forestJuice1-2-light",
    "misc/grotto/forestJuice1-3-light-masc",
    "misc/grotto/forestSpores1-1-light",
    "misc/grotto/forestSpores1-2-light-masc",
    "misc/grotto/forestTentacles1-1-light",
    "misc/grotto/forestTentacles1-2-light",
    "misc/grotto/forestTentacles1-3-light-masc",
    "misc/grotto/ruinsHole1-1-light",
    "misc/grotto/ruinsHole1-2-light",
    "misc/grotto/ruinsMimic1-1-light",
    "misc/grotto/ruinsMimic1-2-light",
    "misc/grotto/ruinsSlimeBlueMeat1-1-light",
    "misc/grotto/ruinsSlimeBlueMeat1-2-light",
    "misc/grotto/ruinsSlimeBlueMeat1-3-light",
    "misc/grotto/ruinsTrap1-1-light",
    "artifacts/telly/rooby/1-1",
    "artifacts/telly/rooby/1-2",
    "artifacts/telly/rooby/1-3",
    "artifacts/telly/rooby/1-4",
    "artifacts/telly/rooby/2-1",
    "artifacts/telly/rooby/2-2",
    "artifacts/telly/rooby/2-3",
    "artifacts/telly/rooby/2-4",
    "artifacts/telly/rooby/3-1",
    "artifacts/telly/rooby/3-2",
    "artifacts/telly/rooby/3-3",
    "artifacts/telly/rooby/3-4",
    "artifacts/telly/rooby/4-1",
    "artifacts/telly/rooby/4-2",
    "artifacts/telly/rooby/4-3",
    "artifacts/telly/rooby/4-4",
    "deity/logbook2",
    "deity/logbook3",
    "deity/logbook4",
]

var randomJiggyArrayVeggie = [
    "carpenter/bandit1-1",
    "carpenter/bandit1-2",
    "carpenter/bandit2-1",
    "carpenter/bandit2-2",
    "carpenter/bandit2-3Veggie",
    "carpenter/bandit3-1",
    "carpenter/bandit3-2",
    "carpenter/bandit3-3",
    "carpenter/bandit4-2",
    "carpenter/bandit4-3-light",
    "carpenter/bandit4-4Veggie",
    "carpenter/bandit4-5-light",
    "carpenter/bandit4-6-light",
    "carpenter/bandit4-7Veggie",
    "carpenter/bandit5-1",
    "carpenter/bandit5-2Veggie",
    "carpenter/bandit5-3Veggie",
    "carpenter/bandit5-4-light",
    "carpenter/bandit5-5-light",
    "carpenter/bandit5-6-light",
    "carpenter/bath1",
    "carpenter/carpenterSnooze1-1",
    "carpenter/carpenterSnooze1-2",
    "carpenter/carpenterSnooze1-3",
    "carpenter/carpenterSnooze1-4",
    "carpenter/carpenterSnooze1-5",
    "carpenter/carpenterSnooze1-6",
    "carpenter/carpenterSnooze2Veggie-1",
    "carpenter/carpenterSnooze2Veggie-2",
    "carpenter/carpenterSnooze2Veggie-3",
    "carpenter/carpenterSnooze2Veggie-5",
    "carpenter/carpenterSnooze2Veggie-6",
    "carpenter/carpenterSnooze2Veggie-7",
    "carpenter/fishingVeggie",
    "carpenter/gatheringVeggie",
    "carpenter/hot1Veggie",
    "carpenter/huntingVeggie",
    "carpenter/logbook2v",
    "carpenter/logbook3v",
    "carpenter/logbook4v",
    "carpenter/magazine1Veggie-0",
    "carpenter/magazine1Veggie-1",
    "carpenter/magazine1Veggie-2",
    "carpenter/magazine1Veggie-3",
    "carpenter/magazine1Veggie-4",
    "carpenter/magazine1Veggie",
    "carpenter/morningSilly1-1",
    "carpenter/morningsSilly1-2",
    "carpenter/repeat1-1Veggie",
    "carpenter/repeat1-2Veggie",
    "carpenter/repeat1-3Veggie",
    "carpenter/wallFront-1",
    "carpenter/wallFront-2",
    "carpenter/wallFront-3",
    "carpenter/wallFront-4",
    "carpenter/wallRearVeggie-01",
    "carpenter/wallRearVeggie-02",
    "carpenter/wallRearVeggie-03",
    "carpenter/wallRearVeggie-04",
    "carpenter/wallRearVeggie-05",
    "carpenter/wallRearVeggie-07",
    "carpenter/wallRearVeggie-09",
    "carpenter/wallRearVeggie-10",
    "carpenter/wallRearVeggie-11",
    "carpenter/wallRearVeggie-11",
    "carpenter/wallRearVeggie-12",
    "foxf/bath1",
    "foxf/fishing",
    "foxf/fun-finish3",
    "foxf/fun-foxf1",
    "foxf/fun-foxf2",
    "foxf/fun-foxf3",
    "foxf/fun-foxf4",
    "foxf/fun-foxf5",
    "foxf/fun-foxf6",
    "foxf/fun-foxf7",
    "foxf/gathering",
    "foxf/hot1",
    "foxf/hunting",
    "foxf/logbook2",
    "foxf/logbook3",
    "foxf/logbook4",
    "foxf/magazine1-1",
    "foxf/magazine1-2",
    "foxf/magazine1-3",
    "foxf/magazine1-4",
    "foxf/magazine1",
    "foxf/mystery-foxf1",
    "foxf/mystery-foxf2",
    "foxf/mystery-foxf3",
    "foxf/mystery-foxf4",
    "foxf/mystery-foxf5",
    "foxf/repeat1-1",
    "foxf/repeat1-2a",
    "foxf/repeat1-2b",
    "foxf/repeat1-3a",
    "foxf/repeat1-3b",
    "foxf/reward1F-1",
    "foxf/reward1F-2",
    "foxf/reward1F-3",
    "foxf/reward1F-4",
    "foxf/reward1F-5",
    "foxf/reward1F-6",
    "foxf/reward1F-7",
    "foxf/reward1F-8",
    "foxf/reward2-1",
    "foxf/reward2-2",
    "foxf/reward2-3",
    "foxf/reward2-4",
    "foxf/reward2-5",
    "foxf/reward2-6rosebud",
    "mayor/bath1Veggie",
    "mayor/gatheringVeggie",
    "mayor/horny2-1",
    "mayor/horny2-2",
    "mayor/horny3Veggie-1",
    "mayor/horny3Veggie-2",
    "mayor/horny3Veggie-3",
    "mayor/horny3Veggie-4",
    "mayor/horny4Veggie-1",
    "mayor/horny4Veggie-2",
    "mayor/horny4Veggie-3",
    "mayor/horny5",
    "mayor/hot1",
    "mayor/huntingVeggie",
    "mayor/intro2",
    "mayor/logbook2v",
    "mayor/logbook3v",
    "mayor/logbook4v",
    "mayor/magazine1Veggie-1",
    "mayor/magazine1Veggie-2",
    "mayor/magazine1Veggie-3",
    "mayor/magazine1Veggie-4",
    "mayor/magazine1Veggie",
    "mayor/mayorMorning-2Veggie-1",
    "mayor/mayorMorning-2Veggie-2",
    "mayor/mayorMorning-5Veggie-1",
    "mayor/mayorMorning-5Veggie-2",
    "mayor/mayorMorning-5Veggie-3",
    "mayor/mayorMorning-5Veggie-4",
    "mayor/mayorMorning8Veggie",
    "mayor/mayorMorning9Veggie-1",
    "mayor/mayorMorning9Veggie-2",
    "mayor/morningSilly1-1",
    "mayor/nightmareVeggie",
    "mayor/nudity1-1-light-masc",
    "mayor/nudity1-2Veggie",
    "mayor/nudity1-4-light-masc",
    "mayor/pounceVeggie-1",
    "mayor/pounceVeggie-2",
    "mayor/pounceVeggie-3",
    "mayor/pounceVeggie-4",
    "mayor/pounceVeggie-5",
    "mayor/pounceVeggie-6",
    "mayor/pounceVeggie-6rosebud",
    "mayor/pounceVeggie-7",
    "mayor/repeat1",
    "mayor/repeat2-1",
    "mayor/repeat2-2",
    "mayor/repeat2-3",
    "mayor/repeat2",
    "mayor/repeat3",
    "mayor/repeat4",
    "mayor/repeat5Veggie",
    "mayor/repeat6",
    "mayor/safe1",
    "mayor/wall-01",
    "mayor/wall-02",
    "mayor/wall-03Veggie",
    "mayor/wall-04",
    "mayor/wall-05",
    "mayor/wall-06",
    "mayor/wall-07Veggie",
    "mayor/wall-08",
    "mayor/wall-09",
    "mayor/wall-10",
    "mayor/horny4Veggie-Unused",
    "milf/bath1",
    "milf/cherry1-1",
    "milf/cherry1-2",
    "milf/cherry1-3",
    "milf/cherry1-4-light",
    "milf/cherry1-5",
    "milf/fishing",
    "milf/gathering",
    "milf/hot1",
    "milf/houseFirst",
    "milf/hunting",
    "milf/intro1",
    "milf/intro2",
    "milf/intro3",
    "milf/logbook2",
    "milf/logbook2a",
    "milf/logbook3",
    "milf/logbook3a",
    "milf/logbook4",
    "milf/magazine1-1",
    "milf/magazine1-2",
    "milf/magazine1-3",
    "milf/magazine1-4",
    "milf/magazine1",
    "milf/milf1-1",
    "milf/milf1a-1",
    "milf/milf1b-1",
    "milf/milf1c-1",
    "milf/milf1c-2",
    "milf/milf1c-3",
    "milf/milf2a-1",
    "milf/milf2b-1",
    "milf/milf2c-1",
    "milf/milf2d-1",
    "milf/milf3-1",
    "milf/milf3-2",
    "milf/milf3-3",
    "milf/milf3-4",
    "milf/milf3a-1",
    "milf/milf3a-2",
    "milf/milf3a-3",
    "milf/milf3a-4",
    "milf/milf3a-5",
    "milf/milf3a-6",
    "milf/milf3b-1",
    "milf/milf3b-2",
    "milf/milf3b-3",
    "milf/milf3b-4",
    "milf/milf3b-5",
    "milf/milf3c-1",
    "milf/milf3c-2",
    "milf/milf3c-3",
    "milf/milf3c-4",
    "milf/milf4-1",
    "milf/milf4-2",
    "milf/milf4-3",
    "milf/milf4-4",
    "milf/milf4-6",
    "milf/morning1",
    "milf/morning2-1",
    "milf/morning2-2",
    "milf/morning2-3",
    "milf/morningSilly1-1",
    "milf/nipplepen",
    "milf/pills1-1-light",
    "milf/pills1-2-light",
    "milf/pills1-3-light",
    "milf/pills1-4-light",
    "milf/pills1-5",
    "milf/repeat1-1",
    "milf/repeat1-2",
    "milf/repeat1-3",
    "milf/repeat1-4",
    "milf/repeat1-5",
    "milf/repeat2-1",
    "milf/repeat2-2",
    "milf/repeat2-3",
    "milf/sisters",
    "milf/watch1-1",
    "milf/watch1-2",
    "milf/watch1-3",
    "milf/watch1-4",
    "milf/watch1-5",
    "milf/watch1-6",
    "milf/wrapup",
    "nun/bath1",
    "nun/fishing",
    "nun/gathering",
    "nun/hot1",
    "nun/hot2",
    "nun/hunting",
    "nun/intro1",
    "nun/intro2",
    "nun/logbook2",
    "nun/logbook3",
    "nun/logbook4",
    "nun/magazine1-1",
    "nun/magazine1-2",
    "nun/magazine1-3",
    "nun/magazine1-4",
    "nun/magazine1",
    "nun/morningSilly1-1",
    "nun/nudity1-1a",
    "nun/nudity1-2-light-masc",
    "nun/nudity1-3-light",
    "nun/nudity1-4a",
    "nun/nun1-1",
    "nun/nun1-2",
    "nun/nun1-3",
    "nun/nun1-4",
    "nun/nun1-5",
    "nun/nun1-6",
    "nun/nun1-7",
    "nun/nun2-0",
    "nun/nun2-1",
    "nun/nun2-2",
    "nun/nun2-3",
    "nun/nun2-4",
    "nun/nun3-0",
    "nun/nun3-1",
    "nun/nun3-2",
    "nun/nun4-1",
    "nun/nun4-2",
    "nun/nun4-3",
    "nun/nun4-3Base",
    "nun/nun5-0",
    "nun/nun5-1",
    "nun/nun5-2",
    "nun/nun5-3",
    "nun/nun5-4",
    "nun/nun5-5",
    "nun/repeat1-2",
    "nun/repeat1-5",
    "nun/repeat2-1",
    "nun/repeat2-2",
    "nun/repeat2-3",
    "nun/repeat2-4",
    "nun/repeat2-5",
    "nun/wall1-1-light",
    "nun/wall1-2-light",
    "nun/wall1-3-light",
    "nun/wall1-4-light",
    "nun/wall1-5-light",
    "nun/wall1-6",
    "sadogato/bath1",
    "sadogato/catpats1-0",
    "sadogato/catpats1-1",
    "sadogato/catpats1-2",
    "sadogato/catpats1-3",
    "sadogato/fishing",
    "sadogato/gathering",
    "sadogato/hole0-1",
    "sadogato/hole00",
    "sadogato/hole1-1",
    "sadogato/hole1-3",
    "sadogato/hole1-4",
    "sadogato/hole2-1",
    "sadogato/hole2-2",
    "sadogato/hole2-3",
    "sadogato/hole2-4",
    "sadogato/hole2-5",
    "sadogato/hole2-6",
    "sadogato/hole2-7",
    "sadogato/hole2-8",
    "sadogato/hole2-9",
    "sadogato/hole2-f",
    "sadogato/hot1",
    "sadogato/hunting",
    "sadogato/intro-1",
    "sadogato/intro-2",
    "sadogato/logbook2",
    "sadogato/logbook3",
    "sadogato/logbook4",
    "sadogato/magazine1-1",
    "sadogato/magazine1-2",
    "sadogato/magazine1-3",
    "sadogato/magazine1-4",
    "sadogato/magazine1",
    "sadogato/morning1-1",
    "sadogato/morning1-2",
    "sadogato/morning1-3",
    "sadogato/morning1-4",
    "sadogato/morning1-5",
    "sadogato/morning1-6",
    "sadogato/morning1-unused",
    "sadogato/pill-1",
    "sadogato/pill-2",
    "sadogato/pill-3",
    "sadogato/pill-4",
    "sadogato/pill-5",
    "sadogato/pill-6",
    "sadogato/reading1-1",
    "sadogato/reading1-2",
    "sadogato/reading2-1",
    "sadogato/reading2-2",
    "sadogato/reading2-3",
    "sadogato/reading2-4",
    "sadogato/reading3-1",
    "sadogato/reading3-2",
    "sadogato/reading3-3",
    "sadogato/reading4-1",
    "sadogato/reading4-2",
    "sadogato/reading4-3",
    "sadogato/reading5-1",
    "sadogato/reading5-10",
    "sadogato/reading5-11",
    "sadogato/reading5-2",
    "sadogato/reading5-3",
    "sadogato/reading5-4",
    "sadogato/reading5-5",
    "sadogato/reading5-6",
    "sadogato/reading5-7",
    "sadogato/reading5-8",
    "sadogato/reading5-9",
    "sadogato/repeat1-1",
    "sadogato/repeat1-2",
    "sadogato/repeat1-3",
    "sadogato/repeat1-4",
    "sadogato/repeat1-5",
    "sadogato/repeat1-6",
    "sadogato/repeat1-7",
    "sadogato/repeat2-1",
    "sadogato/repeat2-2",
    "sadogato/repeat2-3",
    "sadogato/silf",
    "sadogato/wallFront-01",
    "sadogato/wallFront-02",
    "sadogato/wallFront-03",
    "sadogato/wallFront-04",
    "sadogato/wallFront-05",
    "sadogato/wallRear-01",
    "sadogato/wallRear-02",
    "sadogato/wallRear-03",
    "sadogato/wallRear-04",
    "sadogato/wallRear-05",
    "sadogato/wallRear-06",
    "sadogato/wallRear-07",
    "sadogato/wallRear-08",
    "sadogato/wallRear-11",
    "sadogato/wallRear-12",
    "sadogato/watch1-0",
    "sadogato/watch1-1-masc",
    "sadogato/watch1-2-masc",
    "sadogato/watch1-3-masc",
    "sadogato/watch1-4",
    "sadogato/watch1-5",
    "sadogato/watch1-6",
    "sadogato/watch1-7",
    "shopkeep/bath1Veggie",
    "shopkeep/fishingVeggie",
    "shopkeep/gatheringVeggie",
    "shopkeep/hole00",
    "shopkeep/hole01Veggie",
    "shopkeep/hole02",
    "shopkeep/hole03Veggie",
    "shopkeep/hole04Veggie",
    "shopkeep/hole05Veggie",
    "shopkeep/hole06",
    "shopkeep/hole07",
    "shopkeep/hole08Veggie",
    "shopkeep/hole09Veggie",
    "shopkeep/hole10",
    "shopkeep/hole11Veggie",
    "shopkeep/hole11Veggie",
    "shopkeep/hot1Veggie",
    "shopkeep/huntingVeggie",
    "shopkeep/introV",
    "shopkeep/logbook2v",
    "shopkeep/logbook3v",
    "shopkeep/logbook4v",
    "shopkeep/magazine1Veggie-0",
    "shopkeep/magazine1Veggie-1",
    "shopkeep/magazine1Veggie-2",
    "shopkeep/magazine1Veggie-3",
    "shopkeep/magazine1Veggie-4",
    "shopkeep/magazine1Veggie",
    "shopkeep/nightmareVeggie",
    "shopkeep/pet1-1",
    "shopkeep/pet1-2-light",
    "shopkeep/pet1-3-light",
    "shopkeep/pet2-1",
    "shopkeep/pet2-2-light",
    "shopkeep/pet2-3Veggie",
    "shopkeep/pet2-4",
    "shopkeep/pet3-1",
    "shopkeep/pet3-2-light",
    "shopkeep/pet3-3Veggie",
    "shopkeep/pet3-4Veggie-light",
    "shopkeep/pet3-4Veggie-light",
    "shopkeep/pet3-5Veggie-light",
    "shopkeep/pet3-5Veggie-light",
    "shopkeep/pill1Veggie",
    "shopkeep/pill2",
    "shopkeep/pill3",
    "shopkeep/pill4",
    "shopkeep/pill5",
    "shopkeep/pill6",
    "shopkeep/pill7",
    "shopkeep/pill8Veggie",
    "shopkeep/pill9Veggie",
    "shopkeep/reward1Veggie-1",
    "shopkeep/reward1Veggie-2",
    "shopkeep/reward1Veggie-3",
    "shopkeep/reward1Veggie-4",
    "shopkeep/reward1Veggie-5",
    "shopkeep/reward2Veggie-1",
    "shopkeep/reward2Veggie-2",
    "shopkeep/reward2Veggie-4",
    "shopkeep/reward2Veggie-5",
    "shopkeep/reward2Veggie-6",
    "shopkeep/reward2Veggie-7",
    "shopkeep/reward3Veggie-1",
    "shopkeep/reward3Veggie-2",
    "shopkeep/reward3Veggie-3",
    "shopkeep/reward3Veggie-4",
    "shopkeep/reward3Veggie-5",
    "shopkeep/reward3Veggie-6",
    "shopkeep/reward3Veggie-7rosebud",
    "shopkeep/wallFront-1",
    "shopkeep/wallFront-2",
    "shopkeep/wallFront-3",
    "shopkeep/wallFront-4",
    "shopkeep/wallFront-5",
    "shopkeep/wallRearVeggie-01",
    "shopkeep/wallRearVeggie-02",
    "shopkeep/wallRearVeggie-03",
    "shopkeep/wallRearVeggie-04",
    "shopkeep/wallRearVeggie-05",
    "shopkeep/wallRearVeggie-06",
    "shopkeep/wallRearVeggie-07",
    "shopkeep/wallRearVeggie-08",
    "shopkeep/watch0Veggie",
    "shopkeep/watch1Veggie",
    "shopkeep/watch2",
    "shopkeep/watch3Veggie",
    "shopkeep/watch4",
    "shopkeep/watch5",
    "shopkeep/watch6Veggie",
    "shopkeep/watch7Veggie",
    "shopkeep/watch8Veggie",
    "shopkeep/watch9Veggie",
    "shopkeep/watchFVeggie",
    "artifacts/pills3Veggie",
    "artifacts/tv2",
    "artifacts/watch2",
    "wolf/bath1",
    "wolf/cherry1-1",
    "wolf/cherry1-2",
    "wolf/cherry1-3",
    "wolf/cherry1-4",
    "wolf/date1-1",
    "wolf/date1-2",
    "wolf/date1-3",
    "wolf/date1-4",
    "wolf/date1-4alt",
    "wolf/date1-5",
    "wolf/date2-1",
    "wolf/date2-2",
    "wolf/date2-3",
    "wolf/date2-4",
    "wolf/date2-5",
    "wolf/date2-5alt",
    "wolf/date2-6",
    "wolf/date2-7",
    "wolf/date2-8",
    "wolf/date3-1",
    "wolf/date3-2",
    "wolf/date3-3",
    "wolf/date4-1",
    "wolf/date4-2",
    "wolf/date4-3",
    "wolf/date4-4",
    "wolf/date4-5",
    "wolf/date4-6",
    "wolf/date4-6a",
    "wolf/date4-7",
    "wolf/date4-7a",
    "wolf/date4-8rosebud",
    "wolf/dateExtra-1",
    "wolf/dateExtra-2",
    "wolf/dateNude-1",
    "wolf/dateNude-2",
    "wolf/dateNude-3rosebud",
    "wolf/fishing",
    "wolf/gathering",
    "wolf/hot1",
    "wolf/hunting",
    "wolf/intro2",
    "wolf/intro3",
    "wolf/logbook2",
    "wolf/logbook3",
    "wolf/logbook4",
    "wolf/magazine1-0",
    "wolf/magazine1-1",
    "wolf/magazine1-2",
    "wolf/magazine1-3",
    "wolf/magazine1-4",
    "wolf/magazine1",
    "wolf/morning1-2",
    "wolf/morning1-3",
    "wolf/morning1-4",
    "wolf/morning1-5",
    "wolf/morning1-6",
    "wolf/morning1",
    "wolf/pill1-1",
    "wolf/pill1-2",
    "wolf/pill1-3",
    "wolf/pill1-4",
    "wolf/pill1-5",
    "wolf/repeat1-1",
    "wolf/repeat1-2",
    "wolf/repeat1-3",
    "wolf/repeat1-4",
    "wolf/repeat1-5",
    "wolf/repeat1-6",
    "wolf/repeat2-0",
    "wolf/repeat2-1",
    "wolf/repeat2-2",
    "wolf/repeat2-3",
    "wolf/repeat2-4",
    "wolf/repeat2-5",
    "wolf/repeat2-6",
    "wolf/repeat2-7",
    "wolf/repeat2-8",
    "wolf/repeat2-9",
    "wolf/repeat3-1",
    "wolf/repeat3-2",
    "wolf/repeat3-3",
    "wolf/training1-1",
    "wolf/training1-2",
    "wolf/training1-3",
    "wolf/training1-4",
    "wolf/training2-1",
    "wolf/training2-2",
    "wolf/training2-3",
    "wolf/training2-4",
    "wolf/training2-extra",
    "wolf/training3-2",
    "wolf/training3-3",
    "wolf/training3-4",
    "wolf/training3-5",
    "wolf/training3-5alt",
    "wolf/training3-6rosebud",
    "wolf/wallFront-01",
    "wolf/wallFront-02",
    "wolf/wallFront-03",
    "wolf/wallFront-04",
    "wolf/wallFront-05",
    "wolf/wallFront-06",
    "wolf/wallFront-07",
    "wolf/wallRear-01",
    "wolf/wallRear-02",
    "wolf/wallRear-03",
    "wolf/wallRear-04",
    "wolf/wallRear-05",
    "wolf/wallRear-07",
    "wolf/wallRear-09",
    "wolf/wallRear-10",
    "wolf/wallRear-11",
    "wolf/wallRear-12",
    "wolf/wallRear-13Rosebud",
    "wolf/watch1-1",
    "wolf/watch1-2",
    "wolf/watch1-3",
    "wolf/watch1-3Rosebud",
    "wolf/watch1-4",
    "wolf/watch1-5",
    "wolf/watch1-6",
    "wolf/watch1-6Rosebud",
    "wolf/wilf",
    "wolf/wolfMorning-carpenterVeggie",
    "wolf/wolfMorning-doe1",
    "wolf/wolfMorning-mayorVeggie",
    "wolf/wolfMorning-mesu",
    "wolf/wolfMorning-milf",
    "wolf/wolfMorning-mommy",
    "wolf/wolfMorning-nun",
    "wolf/wolfMorning-nun1",
    "wolf/wolfMorning-sadogato",
    "wolf/wolfMorning-sadogato1",
    "wolf/wolfMorning-sadogato2",
    "wolf/wolfMorning-shopkeepVeggie",
    "misc/fishingGoddess1Veggie",
    "misc/fishingGoddess2Veggie",
    "misc/fishingGoddess3Veggie",
    "misc/fishingWishVeggie",
    "misc/gatheringDryadVeggie",
    "misc/gatheringMerchantVeggie",
    "misc/gatheringMushroom1Veggie",
    "misc/gatheringMushroom2Veggie",
    "misc/huntingFairy1Veggie",
    "misc/huntingMaestroVeggie",
    "misc/grotto/forestFairy1-1-light",
    "misc/grotto/forestFairy1-2-light",
    "misc/grotto/forestFairy1-3-light",
    "misc/grotto/forestFairy1-3",
    "misc/grotto/forestSleepChuckster1-1",
    "misc/grotto/ruinsSlimeBlueVeggie1-1-light",
    "misc/grotto/ruinsSlimeBlueVeggie1-2-light",
    "misc/grotto/ruinsSlimeBlueVeggie1-3-light",
    "artifacts/telly/belles/belles1",
    "artifacts/telly/medicenter/catgirl-0-1",
    "artifacts/telly/medicenter/catgirl-0-2",
    "artifacts/telly/medicenter/catgirl-0-3",
    "artifacts/telly/medicenter/catgirl-1a-1",
    "artifacts/telly/medicenter/catgirl-1a-2",
    "artifacts/telly/medicenter/catgirl-1a-3",
    "artifacts/telly/medicenter/catgirl-1a-4",
    "artifacts/telly/medicenter/catgirl-1a-5",
    "artifacts/telly/medicenter/catgirl-1b-1",
    "artifacts/telly/medicenter/catgirl-1b-2",
    "artifacts/telly/medicenter/catgirl-1b-3",
    "artifacts/telly/medicenter/catgirl-1b-4",
    "artifacts/telly/medicenter/catgirl-1b-5",
    "artifacts/telly/rooby/1-0",
    "artifacts/telly/rooby/3-0",
]

var randomJiggyArrayPocketMeat = [
    "neocards/plap_pals/anubis-meat-common-wide-001",
    "neocards/plap_pals/anubis-meat-rare-tall-001",
    "neocards/plap_pals/anubis-meat-uncommon-wide-001",
    "neocards/plap_pals/anubis-meat-uncommon-wide-002",
    "neocards/plap_pals/beegarde-meat-common-wide-001",
    "neocards/plap_pals/beegarde-meat-uncommon-wide-001",
    "neocards/plap_pals/cattiva-meat-feral-common-wide-001",
    "neocards/plap_pals/cattiva-meat-feral-rare-tall-001",
    "neocards/plap_pals/cattiva-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/cattiva-meat-rare-tall-001",
    "neocards/plap_pals/cattiva-meat-uncommon-wide-001",
    "neocards/plap_pals/celesdir-meat-feral-common-wide-001",
    "neocards/plap_pals/celesdir-meat-feral-common-wide-002",
    "neocards/plap_pals/celesdir-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/celesdir-meat-uncommon-wide-001",
    "neocards/plap_pals/chillet-meat-feral-common-wide-001",
    "neocards/plap_pals/chillet-meat-feral-common-wide-002",
    "neocards/plap_pals/chillet-meat-feral-common-wide-003",
    "neocards/plap_pals/chillet-meat-feral-uncommon-tall-001",
    "neocards/plap_pals/chillet-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/chillet-meat-feral-uncommon-wide-002",
    "neocards/plap_pals/chillet-meat-rare-tall-001",
    "neocards/plap_pals/chillet_ignis-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/cremis-meat-feral-common-wide-001",
    "neocards/plap_pals/cremis-meat-feral-common-wide-002",
    "neocards/plap_pals/cremis-meat-feral-rare-tall-001",
    "neocards/plap_pals/cremis-meat-uncommon-wide-001",
    "neocards/plap_pals/daedream-meat-rare-tall-001",
    "neocards/plap_pals/daedream-meat-uncommon-wide-001",
    "neocards/plap_pals/depresso-meat-feral-common-wide-001",
    "neocards/plap_pals/depresso-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/depresso-meat-rare-wide-001",
    "neocards/plap_pals/felbat-meat-common-wide-001",
    "neocards/plap_pals/felbat-meat-common-wide-002",
    "neocards/plap_pals/flambelle-meat-common-wide-001",
    "neocards/plap_pals/flambelle-meat-common-wide-002",
    "neocards/plap_pals/flambelle-meat-rare-wide-001",
    "neocards/plap_pals/foxparks-meat-feral-common-wide-001",
    "neocards/plap_pals/foxparks-meat-feral-common-wide-002",
    "neocards/plap_pals/foxparks-meat-feral-rare-tall-001",
    "neocards/plap_pals/foxparks-meat-uncommon-wide-001",
    "neocards/plap_pals/foxparks_cryst-meat-feral-common-wide-001",
    "neocards/plap_pals/foxparks_cryst-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/frostallion-meat-feral-common-wide-001",
    "neocards/plap_pals/frostallion-meat-feral-rare-tall-001",
    "neocards/plap_pals/frostallion-meat-uncommon-wide-001",
    "neocards/plap_pals/frostallion-meat-uncommon-wide-002",
    "neocards/plap_pals/frostallion_noct-meat-feral-common-wide-001",
    "neocards/plap_pals/frostallion_noct-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/grizzbolt-meat-feral-common-wide-001",
    "neocards/plap_pals/grizzbolt-meat-uncommon-wide-001",
    "neocards/plap_pals/kitsun-meat-common-wide-001",
    "neocards/plap_pals/kitsun-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/kitsun-meat-feral-uncommon-wide-002",
    "neocards/plap_pals/lamball-meat-common-wide-001",
    "neocards/plap_pals/lamball-meat-rare-tall-001",
    "neocards/plap_pals/leezpunk-meat-uncommon-wide-001",
    "neocards/plap_pals/lifmunk-meat-feral-common-wide-001",
    "neocards/plap_pals/lifmunk-meat-feral-common-wide-002",
    "neocards/plap_pals/lifmunk-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/lifmunk-meat-rare-wide-001",
    "neocards/plap_pals/lovander-meat-common-wide-001",
    "neocards/plap_pals/lovander-meat-common-wide-002",
    "neocards/plap_pals/lovander-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/lovander-meat-uncommon-wide-001",
    "neocards/plap_pals/melpaca-meat-feral-common-wide-001",
    "neocards/plap_pals/melpaca-meat-feral-uncommon-wide-001",
    "neocards/plap_pals/nox-meat-feral-common-wide-001",
    "neocards/plap_pals/nox-meat-rare-wide-001",
    "neocards/plap_pals/nox-meat-uncommon-wide-001",
    "neocards/plap_pals/nyafia-meat-common-wide-001",
    "neocards/plap_pals/nyafia-meat-common-wide-002",
    "neocards/plap_pals/nyafia-meat-rare-wide-001",
    "neocards/plap_pals/orserk-meat-common-wide-001",
    "neocards/plap_pals/quivern-meat-common-wide-001",
    "neocards/plap_pals/quivern-meat-common-wide-002",
    "neocards/plap_pals/quivern-meat-rare-tall-001",
    "neocards/plap_pals/quivern-meat-uncommon-wide-001",
    "neocards/plap_pals/wixen-meat-common-wide-001",
    "neocards/plap_pals/wixen-meat-uncommon-wide-001",
    "neocards/plap_pals/beegarde-futameat-rare-wide-001",
    "neocards/plap_pals/bellanoir-futameat-rare-tall-001",
    "neocards/plap_pals/bellanoir-futameat-uncommon-wide-001",
    "neocards/plap_pals/bellanoir_libero-futameat-common-wide-001",
    "neocards/plap_pals/celesdir-futameat-feral-rare-wide-001",
    "neocards/plap_pals/celesdir-futameat-rare-wide-001",
    "neocards/plap_pals/chillet_ignis-futameat-feral-common-wide-001",
    "neocards/plap_pals/cremis-futameat-uncommon-wide-001",
    "neocards/plap_pals/daedream-futameat-common-wide-001",
    "neocards/plap_pals/daedream-futameat-rare-wide-001",
    "neocards/plap_pals/dazzi-futameat-common-wide-001",
    "neocards/plap_pals/dazzi-futameat-feral-uncommon-wide-001",
    "neocards/plap_pals/dazzi-futameat-rare-tall-001",
    "neocards/plap_pals/dazzi-futameat-uncommon-wide-001",
    "neocards/plap_pals/felbat-futameat-rare-wide-001",
    "neocards/plap_pals/flopie-futameat-feral-rare-tall-001",
    "neocards/plap_pals/flopie-futameat-feral-uncommon-wide-001",
    "neocards/plap_pals/flopie-futameat-feral-uncommon-wide-002",
    "neocards/plap_pals/flopie-futameat-rare-wide-001",
    "neocards/plap_pals/foxparks-futameat-feral-rare-tall-001",
    "neocards/plap_pals/frostallion_noct-futameat-rare-wide-001",
    "neocards/plap_pals/gloopie-futameat-rare-wide-001",
    "neocards/plap_pals/icelyn-futameat-rare-tall-001",
    "neocards/plap_pals/katress-futameat-common-wide-001",
    "neocards/plap_pals/katress-futameat-common-wide-002",
    "neocards/plap_pals/katress-futameat-rare-tall-001",
    "neocards/plap_pals/katress-futameat-rare-wide-001",
    "neocards/plap_pals/katress-futameat-uncommon-wide-001",
    "neocards/plap_pals/lamball-futameat-common-wide-001",
    "neocards/plap_pals/lamball-futameat-rare-tall-001",
    "neocards/plap_pals/lamball-futameat-uncommon-wide-001",
    "neocards/plap_pals/lifmunk-futameat-rare-wide-001",
    "neocards/plap_pals/lovander-futameat-rare-wide-001",
    "neocards/plap_pals/lovander-futameat-rare-wide-002",
    "neocards/plap_pals/lunaris-futameat-common-wide-001",
    "neocards/plap_pals/lunaris-futameat-common-wide-002",
    "neocards/plap_pals/lunaris-futameat-rare-tall-001",
    "neocards/plap_pals/lunaris-futameat-rare-wide-001",
    "neocards/plap_pals/lyleen-futameat-rare-tall-001",
    "neocards/plap_pals/lyleen-futameat-rare-wide-001",
    "neocards/plap_pals/lyleen-futameat-uncommon-wide-001",
    "neocards/plap_pals/lyleen-futameat-uncommon-wide-002",
    "neocards/plap_pals/lyleen_noct-futameat-rare-wide-001",
    "neocards/plap_pals/lyleen_noct-futameat-uncommon-wide-001",
    "neocards/plap_pals/lyleen_noct-futameat-uncommon-wide-002",
    "neocards/plap_pals/melpaca-futameat-rare-wide-001",
    "neocards/plap_pals/nox-futameat-rare-wide-001",
    "neocards/plap_pals/orserk-futameat-uncommon-wide-001",
    "neocards/plap_pals/petallia-futameat-common-wide-001",
    "neocards/plap_pals/petallia-futameat-rare-tall-001",
    "neocards/plap_pals/petallia-futameat-uncommon-wide-001",
    "neocards/plap_pals/petallia-futameat-uncommon-wide-002",
    "neocards/plap_pals/quivern-futameat-common-wide-001",
    "neocards/plap_pals/selyne-futameat-common-wide-001",
    "neocards/plap_pals/selyne-futameat-rare-tall-001",
    "neocards/plap_pals/selyne-futameat-uncommon-wide-001",
    "neocards/plap_pals/sibelyx-futameat-rare-tall-001",
    "neocards/plap_pals/sibelyx-futameat-uncommon-wide-001",
    "neocards/plap_pals/sibelyx-futameat-uncommon-wide-002",
    "neocards/plap_pals/splatterina-futameat-common-wide-001",
    "neocards/plap_pals/splatterina-futameat-rare-tall-001",
    "neocards/plap_pals/splatterina-futameat-uncommon-wide-001",
    "neocards/plap_pals/splatterina-futameat-uncommon-wide-002",
    "neocards/plap_pals/tarantris-futameat-common-wide-001",
    "neocards/plap_pals/tarantris-futameat-rare-tall-001",
    "neocards/plap_pals/tarantris-futameat-uncommon-wide-001",
    "neocards/plap_pals/wixen-futameat-rare-wide-001",
]

var randomJiggyArrayPocketVeggie = [
    "neocards/plap_pals/anubis-veggie-common-wide-001",
    "neocards/plap_pals/anubis-veggie-common-wide-002",
    "neocards/plap_pals/anubis-veggie-rare-tall-001",
    "neocards/plap_pals/anubis-veggie-uncommon-wide-001",
    "neocards/plap_pals/beegarde-veggie-common-wide-001",
    "neocards/plap_pals/beegarde-veggie-rare-wide-001",
    "neocards/plap_pals/beegarde-veggie-uncommon-wide-001",
    "neocards/plap_pals/bellanoir-veggie-common-wide-001",
    "neocards/plap_pals/bellanoir-veggie-common-wide-002",
    "neocards/plap_pals/bellanoir_libero-veggie-rare-wide-001",
    "neocards/plap_pals/bellanoir_libero-veggie-uncommon-wide-001",
    "neocards/plap_pals/cattiva-veggie-feral-common-wide-001",
    "neocards/plap_pals/cattiva-veggie-feral-common-wide-002",
    "neocards/plap_pals/cattiva-veggie-feral-rare-tall-001",
    "neocards/plap_pals/cattiva-veggie-uncommon-wide-001",
    "neocards/plap_pals/celesdir-veggie-feral-common-wide-001",
    "neocards/plap_pals/celesdir-veggie-uncommon-wide-001",
    "neocards/plap_pals/chillet-veggie-common-wide-001",
    "neocards/plap_pals/chillet-veggie-feral-rare-tall-001",
    "neocards/plap_pals/chillet-veggie-feral-uncommon-wide-001",
    "neocards/plap_pals/chillet-veggie-rare-tall-001",
    "neocards/plap_pals/chillet_ignis-veggie-common-wide-001",
    "neocards/plap_pals/chillet_ignis-veggie-feral-rare-wide-001",
    "neocards/plap_pals/cremis-veggie-common-wide-001",
    "neocards/plap_pals/cremis-veggie-feral-rare-tall-001",
    "neocards/plap_pals/cremis-veggie-uncommon-wide-001",
    "neocards/plap_pals/daedream-veggie-common-wide-001",
    "neocards/plap_pals/daedream-veggie-uncommon-wide-001",
    "neocards/plap_pals/dazzi-veggie-common-wide-001",
    "neocards/plap_pals/dazzi-veggie-rare-tall-001",
    "neocards/plap_pals/dazzi-veggie-uncommon-wide-001",
    "neocards/plap_pals/depresso-veggie-common-wide-001",
    "neocards/plap_pals/felbat-veggie-rare-wide-001",
    "neocards/plap_pals/felbat-veggie-uncommon-wide-001",
    "neocards/plap_pals/felbat-veggie-uncommon-wide-002",
    "neocards/plap_pals/flambelle-veggie-rare-wide-001",
    "neocards/plap_pals/flambelle-veggie-uncommon-wide-001",
    "neocards/plap_pals/flambelle-veggie-uncommon-wide-002",
    "neocards/plap_pals/flopie-veggie-feral-common-wide-001",
    "neocards/plap_pals/flopie-veggie-feral-common-wide-002",
    "neocards/plap_pals/foxparks-veggie-feral-uncommon-wide-001",
    "neocards/plap_pals/frostallion-veggie-common-wide-001",
    "neocards/plap_pals/frostallion-veggie-feral-rare-tall-001",
    "neocards/plap_pals/frostallion_noct-veggie-feral-common-wide-001",
    "neocards/plap_pals/frostallion_noct-veggie-feral-rare-wide-001",
    "neocards/plap_pals/frostallion_noct-veggie-uncommon-wide-001",
    "neocards/plap_pals/gloopie-veggie-common-wide-001",
    "neocards/plap_pals/grizzbolt-veggie-feral-common-wide-001",
    "neocards/plap_pals/grizzbolt-veggie-rare-wide-001",
    "neocards/plap_pals/icelyn-veggie-common-wide-001",
    "neocards/plap_pals/icelyn-veggie-veggie-uncommon-tall-001",
    "neocards/plap_pals/katress-veggie-common-wide-001",
    "neocards/plap_pals/katress-veggie-uncommon-wide-001",
    "neocards/plap_pals/kitsun-veggie-common-wide-001",
    "neocards/plap_pals/kitsun-veggie-rare-wide-001",
    "neocards/plap_pals/lamball-veggie-common-wide-001",
    "neocards/plap_pals/lamball-veggie-common-wide-002",
    "neocards/plap_pals/lamball-veggie-rare-tall-001",
    "neocards/plap_pals/lamball-veggie-uncommon-tall-001",
    "neocards/plap_pals/lamball-veggie-uncommon-wide-001",
    "neocards/plap_pals/leezpunk-veggie-common-wide-001",
    "neocards/plap_pals/lifmunk-veggie-feral-common-wide-001",
    "neocards/plap_pals/lifmunk-veggie-uncommon-wide-001",
    "neocards/plap_pals/lifmunk-veggie-veggie-uncommon-wide-001",
    "neocards/plap_pals/lovander-veggie-common-wide-001",
    "neocards/plap_pals/lovander-veggie-common-wide-002",
    "neocards/plap_pals/lovander-veggie-rare-wide-001",
    "neocards/plap_pals/lovander-veggie-uncommon-wide-001",
    "neocards/plap_pals/lovander-veggie-uncommon-wide-002",
    "neocards/plap_pals/lunaris-veggie-common-wide-001",
    "neocards/plap_pals/lunaris-veggie-rare-tall-001",
    "neocards/plap_pals/lunaris-veggie-uncommon-wide-001",
    "neocards/plap_pals/lunaris-veggie-uncommon-wide-002",
    "neocards/plap_pals/lunaris-veggie-uncommon-wide-003",
    "neocards/plap_pals/lyleen-veggie-common-wide-001",
    "neocards/plap_pals/lyleen-veggie-common-wide-002",
    "neocards/plap_pals/lyleen-veggie-rare-tall-001",
    "neocards/plap_pals/lyleen-veggie-uncommon-wide-001",
    "neocards/plap_pals/lyleen_noct-veggie-common-wide-001",
    "neocards/plap_pals/melpaca-veggie-feral-common-wide-001",
    "neocards/plap_pals/melpaca-veggie-feral-uncommon-wide-001",
    "neocards/plap_pals/nox-veggie-feral-common-wide-001",
    "neocards/plap_pals/nox-veggie-feral-uncommon-wide-001",
    "neocards/plap_pals/nyafia-veggie-rare-wide-001",
    "neocards/plap_pals/nyafia-veggie-uncommon-wide-001",
    "neocards/plap_pals/nyafia-veggie-uncommon-wide-002",
    "neocards/plap_pals/petallia-veggie-common-wide-001",
    "neocards/plap_pals/petallia-veggie-rare-tall-001",
    "neocards/plap_pals/quivern-veggie-rare-tall-001",
    "neocards/plap_pals/quivern-veggie-uncommon-wide-001",
    "neocards/plap_pals/quivern-veggie-uncommon-wide-002",
    "neocards/plap_pals/selyne-veggie-common-wide-001",
    "neocards/plap_pals/selyne-veggie-rare-tall-001",
    "neocards/plap_pals/selyne-veggie-uncommon-wide-001",
    "neocards/plap_pals/sibelyx-veggie-common-wide-001",
    "neocards/plap_pals/sibelyx-veggie-common-wide-002",
    "neocards/plap_pals/sibelyx-veggie-rare-tall-001",
    "neocards/plap_pals/splatterina-veggie-common-wide-001",
    "neocards/plap_pals/splatterina-veggie-rare-tall-001",
    "neocards/plap_pals/tarantris-veggie-feral-common-wide-001",
    "neocards/plap_pals/tarantris-veggie-uncommon-wide-001",
    "neocards/plap_pals/vixy-veggie-feral-common-wide-001",
    "neocards/plap_pals/wixen-veggie-common-wide-001",
    "neocards/plap_pals/wixen-veggie-rare-wide-001",
    "neocards/plap_pals/wixen-veggie-uncommon-wide-001",
]

function jiggyEasyToggle() {
    if (checkFlag("player", "easyJiggy") == true) {
        removeFlag("player", "easyJiggy");
    }
    else {
        addFlag("player", "easyJiggy");
    }
    listCollectables("jiggy");
}

function killJiggy() {
    openButton();
    if (document.getElementById("jiggyButtonHolders")) {
        document.getElementById("jiggyButtonHolders").remove();
    }
    var _w = document.getElementById("wrapper");
    if (_w) { _w.style.overscrollBehavior = ''; } // undo the jiggy pull-to-refresh lock
    removeJiggyBar();
    // Capture the category we were browsing BEFORE listCollectables resets it to the first one,
    // then re-list it so finishing/leaving a jiggy returns you to the same category.
    var _returnCat = (typeof currentJiggyCategory !== "undefined") ? currentJiggyCategory : "";
    changeLocation('collectionRoom');
    listCollectables("jiggy")
    if (_returnCat) { listJiggies(_returnCat); }
    currentJiggy = ``;
    currentImage = ``;
}

// Initialize the number of rows and columns
let piecesPerRow;
let piecesPerColumn;

var randomJiggy = false;

/* =====================================================================
   Mid-game image swap  (rebuilt feature)
   ---------------------------------------------------------------------
   A jiggy can morph through a sequence of images as you solve it. Two
   OPTIONAL fields on the collectable entry (in collectables.js) drive it,
   and absence of them keeps the original single-image behaviour, so every
   existing entry is untouched / backwards compatible:

     swapImages:  ["mayor/jiggyCozy-2", "mayor/jiggyCozy-3"]
                  The live cycle is [baseImage, ...swapImages] and the index
                  WRAPS, so the same 1-2 list naturally gives 1-2-1-2, and a
                  1-2-3 list gives 1-2-3-1-2-3, etc.
     swapTrigger: 'every'     -> advance one stage on every new link
                  'every 4'   -> advance one stage every 4 new links
                  25          -> advance one stage each time post-assembly
                                 progress crosses another 25%
                  (a bare number = percent mode; default if omitted = 50%)

   Triggers are ARMED only after the opening build / cluster auto-assembly,
   so the initial combine never flashes the art (epilepsy-safe) and never
   counts toward the % — e.g. a 50% trigger in cluster mode fires when you're
   halfway through joining the pre-made clusters, not during their assembly.

   Pass swapImages/swapTrigger straight into getJiggyWithIt() to test from
   the console without a collectable entry.
   ===================================================================== */
var jiggyLinkCount = 0;        // unique locks formed since this puzzle was built
var jiggySwapArmed = false;    // triggers ignored until the opening combine finishes
var jiggySwapBaseline = 0;     // jiggyLinkCount captured the moment we arm
var jiggySwapTotalLinks = 0;   // locks present in a fully solved puzzle
var jiggySwapSequence = [];    // cleaned srcs: [base, ...extras]
var jiggySwapStepsDone = 0;    // how many advances have already fired
var jiggySwapIndex = 0;        // current index into jiggySwapSequence
var jiggySwapMode = "percent"; // 'pieces' | 'percent'
var jiggySwapInterval = 50;    // links-per-step (pieces) or percent-per-step
var jiggyRewardSequence = [];  // cleaned srcs for the win-screen click-to-cycle
var jiggyRewardIndex = 0;
var jiggySwapBaselineClusters = 0; // cluster count the moment we arm (after the opening combine)
var jiggySwapLastMerges = 0;       // merges seen at the last check (gate so empty clicks don't swap)
var jiggyPieceLayoutSize = 0;      // current puzzle's layout piece size (px) — fit-zoom floor
var jiggyMinPieceDisplay = 30;     // smallest displayed piece size we allow (px)

function parseJiggyTrigger(trigger) {
    // -> {mode:'pieces'|'percent', interval:Number}
    if (trigger === undefined || trigger === null || trigger === "") return { mode: "percent", interval: 50 };
    if (typeof trigger === "number") return { mode: "percent", interval: (trigger > 0 ? trigger : 50) };
    var t = String(trigger).trim().toLowerCase();
    if (t === "every") return { mode: "pieces", interval: 1 };
    if (t.indexOf("every") === 0) {
        var n = parseInt(t.replace("every", "").trim(), 10);
        return { mode: "pieces", interval: (n > 0 ? n : 1) };
    }
    var num = parseFloat(t);
    if (!isNaN(num) && num > 0) return { mode: "percent", interval: num };
    return { mode: "percent", interval: 50 };
}

function getJiggySwapConfig(ref) {
    // ref = a jiggy index (flag) OR an image path; find that entry's swap settings.
    if (typeof globalCollectablesArray === "undefined" || !ref) return {};
    for (var i = 0; i < globalCollectablesArray.length; i++) {
        var entry = globalCollectablesArray[i];
        if (!entry || entry.category !== "jiggy") continue;
        if (entry.index === ref || entry.image === ref || cleanupImage(entry.image) === cleanupImage(ref)) {
            return { swapImages: entry.swapImages, swapTrigger: entry.swapTrigger };
        }
    }
    return {};
}

function resetJiggySwap(baseImageCleaned, swapImages, swapTrigger) {
    jiggyLinkCount = 0;
    jiggySwapArmed = false;
    jiggySwapBaseline = 0;
    jiggySwapTotalLinks = 0;
    jiggySwapStepsDone = 0;
    jiggySwapIndex = 0;
    var extras = Array.isArray(swapImages) ? swapImages : [];
    jiggySwapSequence = [baseImageCleaned].concat(extras.map(function (s) { return cleanupImage(s); }));
    var parsed = parseJiggyTrigger(swapTrigger);
    jiggySwapMode = parsed.mode;
    jiggySwapInterval = parsed.interval;
    jiggySwapBaselineClusters = 0;
    jiggySwapLastMerges = 0;
    jiggyRewardSequence = jiggySwapSequence.slice(); // win-screen cycler shares the same images
    jiggyRewardIndex = 0;
}

function countJiggyClusters() {
    // Number of distinct locked groups currently on the board (each fully-separate piece counts as one).
    var seen = new Set();
    var count = 0;
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        if (seen.has(piece.id)) continue;
        getLockedCluster(piece).forEach(function (id) { seen.add(id); });
        count++;
    }
    return count;
}

function armJiggySwap() {
    // Called once the opening build / auto-assembly is finished. Baseline = the cluster count right now,
    // so the opening combine never counts toward a swap.
    jiggySwapBaselineClusters = countJiggyClusters();
    jiggySwapStepsDone = 0;
    jiggySwapIndex = 0;
    jiggySwapLastMerges = 0;
    jiggySwapArmed = (jiggySwapSequence && jiggySwapSequence.length >= 2);
    ensureJiggyBar();
    updateJiggyBar(0);
}

function ensureJiggyBar() {
    // Progress bar for percent-mode swap puzzles. Lives IN-FLOW just under the puzzle (by the Back
    // button) rather than hovering over the viewport, so it doesn't block the board and is cleared
    // automatically when output is wiped on win. Shows overall % solved; the tick marks inside it
    // mark where each image swap happens.
    removeJiggyBar();
    if (jiggySwapMode !== "percent" || jiggySwapSequence.length < 2) return;
    var anchor = document.getElementById('puzzleContainer');
    if (!anchor) return;
    var seg = jiggySwapInterval || 50;
    var ticks = '';
    for (var t = seg; t < 99.5; t += seg) {
        ticks += '<div style="position:absolute;top:0;bottom:0;left:' + t + '%;width:2px;background:rgba(0,0,0,0.55);"></div>';
    }
    var bar = document.createElement('div');
    bar.id = 'jiggySwapBar';
    bar.style.cssText = 'margin:10px auto;max-width:80%;background:#565656;border-radius:13px;padding:3px;';
    bar.innerHTML =
        '<div style="position:relative;height:16px;border-radius:10px;overflow:hidden;background:#3a3a3a;">' +
            '<div id="jiggySwapBarFill" style="height:100%;width:0%;background-image:linear-gradient(to right, red, orange, yellow, green);transition:width 0.25s;"></div>' +
            ticks +
        '</div>' +
        '<p id="jiggySwapBarLabel" style="margin:2px 0 0;text-align:center;font-size:var(--fs-tiny, 12px);color:#fff;">0% solved</p>';
    anchor.insertAdjacentElement('afterend', bar);
}

function updateJiggyBar(mergesDone) {
    if (jiggySwapMode !== "percent" || jiggySwapSequence.length < 2) return;
    var fill = document.getElementById('jiggySwapBarFill');
    if (!fill) return;
    var totalMerges = jiggySwapBaselineClusters - 1;
    if (totalMerges <= 0) totalMerges = 1;
    if (mergesDone === undefined) mergesDone = 0;
    var pct = Math.max(0, Math.min(100, (mergesDone / totalMerges) * 100));
    fill.style.width = pct + '%'; // overall % solved; ticks mark the swap points
    var label = document.getElementById('jiggySwapBarLabel');
    if (label) label.textContent = Math.round(pct) + '%';
}

function removeJiggyBar() {
    var bar = document.getElementById('jiggySwapBar');
    if (bar) bar.remove();
}

function swapPuzzleImage(src) {
    // "Cleaned" srcs stored at puzzle start (jiggySwapSequence) can be STALE LAZY-LOAD MARKERS
    // ("…none.webp#<path>") for mod images that hadn't materialized yet. Painting a marker onto the
    // pieces blanked the whole board (only the piece borders survived), and nothing ever repainted
    // it — the blob finished loading long before the swap fired, so no repaintModImage pass was
    // coming. Re-clean at paint time (returns the real blob URL once ready), and if the blob is
    // STILL in flight, wait for it rather than painting the marker.
    src = cleanupImage(src);
    if (typeof src === "string" && src.indexOf("none.webp#") !== -1) {
        resolveJiggyImage(src, function (realSrc) { swapPuzzleImage(realSrc); });
        return;
    }
    // Repaint every piece + the faded backdrop; positions/locks untouched.
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        piece.style.backgroundImage = `url('${src}')`;
    }
    var bg = document.getElementById('wrapperBG');
    if (bg) bg.style.backgroundImage = "url(" + src + ")";
}

function updateJiggySwap() {
    // Progress is measured by CLUSTER MERGES since the opening combine — each join of two groups is one
    // merge. This is linear in player actions, so percent swaps land evenly. (Link-counting bunched
    // them near the end, where a single merge fuses many links at once.) Advances at most one stage per
    // action; if a big merge overshoots a threshold, the next merges catch up one stage at a time.
    if (!jiggySwapArmed || jiggySwapSequence.length < 2) return;
    var totalMerges = jiggySwapBaselineClusters - 1; // merges to reach a single solved cluster
    if (totalMerges <= 0) { return; }
    var merges = jiggySwapBaselineClusters - countJiggyClusters();
    if (merges < 0) merges = 0;

    var targetSteps;
    if (jiggySwapMode === "pieces") {
        targetSteps = Math.floor(merges / jiggySwapInterval);                       // swap every N merges
    } else {
        targetSteps = Math.floor(((merges / totalMerges) * 100) / jiggySwapInterval); // swap every N% solved
    }

    if (merges > jiggySwapLastMerges && targetSteps > jiggySwapStepsDone) {
        jiggySwapStepsDone++; // one stage per merge; predictable, no skips
        jiggySwapIndex = jiggySwapStepsDone % jiggySwapSequence.length;
        swapPuzzleImage(jiggySwapSequence[jiggySwapIndex]);
    }
    jiggySwapLastMerges = merges;
    updateJiggyBar(merges);
}

function cycleJiggyReward(imgEl) {
    if (!jiggyRewardSequence || jiggyRewardSequence.length < 2) return;
    jiggyRewardIndex = (jiggyRewardIndex + 1) % jiggyRewardSequence.length;
    // Stored entries can be stale lazy-load markers for mod images — re-clean at use so the
    // <img> gets the real blob URL instead of a blank placeholder.
    imgEl.src = cleanupImage(jiggyRewardSequence[jiggyRewardIndex]);
    soundEffectStart("button");
}

function scatterClusters() {
    // After cluster mode's opening combine the buckets sit in their solved arrangement, which made
    // the puzzle trivial (and the old shelf-pack stacked them in reading order / portrait-tall).
    // Instead: drop each cluster at a RANDOM grid-snapped spot inside a field that keeps the puzzle's
    // own aspect (so it stays wide on a wide image, not a tall column) and is only modestly bigger
    // than the solved puzzle. Largest clusters placed first; each tries several spots and takes the
    // least-overlapping. Some overlap is fine — far rarer than no scatter, without trivializing.
    try {
        var container = document.getElementById('puzzleContainer');
        if (!container) return;
        var grid = getGridSize();
        var pw = grid.w, ph = grid.h;
        if (!pw || !ph) return;

        // Gather clusters with their bounding boxes.
        var seen = new Set();
        var clusters = [];
        for (const piece of document.getElementsByClassName('puzzle-piece')) {
            if (seen.has(piece.id)) continue;
            var ids = Array.from(getLockedCluster(piece));
            ids.forEach(function (id) { seen.add(id); });
            var minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
            for (var k = 0; k < ids.length; k++) {
                var p = document.getElementById(ids[k]);
                var l = parseInt(p.style.left) || 0;
                var t = parseInt(p.style.top) || 0;
                if (l < minL) minL = l;
                if (t < minT) minT = t;
                if (l + pw > maxR) maxR = l + pw;
                if (t + ph > maxB) maxB = t + ph;
            }
            clusters.push({ ids: ids, minL: minL, minT: minT, w: maxR - minL, h: maxB - minT });
        }
        // Biggest first so the large chunks claim space before the small ones fill gaps.
        clusters.sort(function (a, b) { return (b.w * b.h) - (a.w * a.h); });

        // Field ≈ the solved puzzle, grown a little, keeping the puzzle's aspect.
        var factor = 1.4;
        var fieldW = Math.max(pw * piecesPerRow * factor, pw * 2);
        var fieldH = Math.max(ph * piecesPerColumn * factor, ph * 2);

        var placed = []; // {l,t,w,h}
        for (var c = 0; c < clusters.length; c++) {
            var cl = clusters[c];
            var maxX = Math.max(0, fieldW - cl.w);
            var maxY = Math.max(0, fieldH - cl.h);
            var bestL = cl.minL, bestT = cl.minT, bestOverlap = Infinity;
            for (var attempt = 0; attempt < 24; attempt++) {
                var tryL = Math.round((Math.random() * maxX) / pw) * pw;
                var tryT = Math.round((Math.random() * maxY) / ph) * ph;
                var overlap = 0;
                var m = Math.min(pw, ph); // bias toward leaving ~1 piece of breathing room
                for (var q = 0; q < placed.length; q++) {
                    var o = placed[q];
                    var ox = Math.max(0, Math.min(tryL + cl.w + m, o.l + o.w) - Math.max(tryL - m, o.l));
                    var oy = Math.max(0, Math.min(tryT + cl.h + m, o.t + o.h) - Math.max(tryT - m, o.t));
                    overlap += ox * oy;
                }
                if (overlap < bestOverlap) { bestOverlap = overlap; bestL = tryL; bestT = tryT; }
                if (overlap === 0) break;
            }
            moveClusterBy(document.getElementById(cl.ids[0]), bestL - cl.minL, bestT - cl.minT);
            placed.push({ l: bestL, t: bestT, w: cl.w, h: cl.h });
        }

        container.style.width = Math.round(fieldW) + "px";
        container.style.height = Math.round(fieldH) + "px";
    } catch (e) {
        console.error("scatterClusters failed", e);
    }
}

function fitJiggyToViewport() {
    // Start zoomed so the whole board is visible (cluster mode especially built boards far larger
    // than the screen, forcing several manual zoom-outs). Only ever zooms OUT, never in.
    try {
        var container = document.getElementById('puzzleContainer');
        var wrap = document.getElementById('wrapper');
        if (!container || !wrap) return;
        var cw = parseInt(container.style.width) || container.offsetWidth;
        var ch = parseInt(container.style.height) || container.offsetHeight;
        if (!cw || !ch) return;
        var fit = Math.min(wrap.clientWidth / cw, wrap.clientHeight / ch) * 0.97; // small margin
        // Never zoom out so far that pieces drop below a grabbable size — keeping pieces usable ranks
        // above fitting the whole board on screen, so the board is allowed to overflow instead.
        if (jiggyPieceLayoutSize > 0) {
            var minScale = Math.min(1, jiggyMinPieceDisplay / jiggyPieceLayoutSize);
            fit = Math.max(fit, minScale);
        }
        var defaultScale = 0.6
        if (!checkFlag("player","easyJiggy")) defaultScale = 1
        scale = Math.min(fit, defaultScale); // cap at 1 so small puzzles aren't blown up
        container.style.transformOrigin = '0 0';
        container.style.transform = `scale(${scale})`;
    } catch (e) {
        console.error("fitJiggyToViewport failed", e);
    }
}

function jiggyTest() {
    // TEMP (mobile has no console): wired onto the title "Mods" button so jiggy can be eyeballed on a
    // phone. Forces CLUSTER mode so the reworked scatter + fit-zoom get exercised. Remove before release.
    if (typeof data === "undefined") { window.data = {}; }
    if (!data.player) { data.player = {}; }
    if (typeof data.player.flags !== "string") { data.player.flags = ""; }
    if (!data.player.flags.includes("easyJiggy,")) { data.player.flags += "easyJiggy,"; }
    getJiggyWithIt("locations/exteriorClean", 12, "test", ["locations/exteriorClean-Night", "locations/exteriorClean-Evening"], 25);
}

function customTest() {
    document.getElementById("wrapper").insertAdjacentHTML("beforeend", `<input type="file" id="jiggyUpload" accept="image/*"></input>`);
    document.getElementById("jiggyUpload").addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);

        // Call your existing function
        getJiggyWithIt(
            imageURL,   // image
            100,         // test piece count
            "userUpload"
        );
    });
}

function getJiggyWithIt(image, totalPieces, flag, swapImages, swapTrigger) {
    showJiggyLoading("Preparing puzzle…");

    randomJiggy = false;
    console.info(image)
    if (image == "randomMeat") {
        randomJiggy = true;
        //Grab a random image from the randomJiggyArrayMeat
        image = cleanupImage(randomJiggyArrayMeat[getRandomInt(randomJiggyArrayMeat.length)]);
        flag = image;
        totalPieces = 50+getRandomInt(100);
    }
    if (image == "randomVeggie") {
        randomJiggy = true;
        image = cleanupImage(randomJiggyArrayVeggie[getRandomInt(randomJiggyArrayVeggie.length)]);
        flag = image;
        totalPieces = 50+getRandomInt(100);
    }
    if (image == "randomPocket") {
        randomJiggy = true;
        var fullJiggyArrayPocket = []
        if (data.player.vegetarian != true) {
            for (let i = 0; i < randomJiggyArrayPocketMeat.length; i++) {
                fullJiggyArrayPocket.push(randomJiggyArrayPocketMeat[i]);
            }
        }
        if (data.player.carnivore != true) {
            for (let i = 0; i < randomJiggyArrayPocketVeggie.length; i++) {
                fullJiggyArrayPocket.push(randomJiggyArrayPocketVeggie[i]);
            }
        }
        image = cleanupImage(fullJiggyArrayPocket[getRandomInt(fullJiggyArrayPocket.length)]);
        flag = image;
        totalPieces = 70+getRandomInt(80);
    }
    image = cleanupImage(image);
    changeBG(image)
    currentJiggy = flag;
    currentImage = image;
    // Mid-game image swap: take directly-passed args (console testing) or look them up by flag.
    if (swapImages === undefined && swapTrigger === undefined) {
        var _swapCfg = getJiggySwapConfig(flag);
        swapImages = _swapCfg.swapImages;
        swapTrigger = _swapCfg.swapTrigger;
    }
    resetJiggySwap(image, swapImages, swapTrigger);
	wrapper.scrollTop = 0;
	document.getElementById('output').innerHTML = '';
    if (checkFlag("player","easyJiggy")) {
        totalPieces = totalPieces*2;
        totalPieces = totalPieces+60;
    }
    else {
        totalPieces = totalPieces;
    }
    scale = 1
	closeButton();
	deleteWindow();
	// Floating zoom/exit stack. Positioned + sized to match the open/close menu arrows via CSS
	// (#jiggyButtonHolders / .jiggyButton in style.css). CSS hides it in PORTRAIT, where the
	// writeHTML zoom/back buttons at the bottom of the scene take over instead.
	// insertAdjacentHTML, NOT innerHTML += — the += form re-parses ALL of #wrapper's children into
	// clones, which detaches the mod editor's hiddenImageInput (its change events then never bubble
	// to the document listener, silently killing every card-image upload for the rest of the session).
	document.getElementById("wrapper").insertAdjacentHTML("beforeend", `
        <div id="jiggyButtonHolders">
        <div id="jiggyZoomIn"  class="jiggyButton" onclick="zoomIn()">+</div>
        <div id="jiggyZoomOut" class="jiggyButton" onclick="zoomOut()">-</div>
        <div id="jiggyExit"    class="jiggyButton" onclick="killJiggy()">X</div>
        </div>
    `);

    const occupiedSpaces = [];


    // Create the puzzle container
    const puzzleContainer = document.createElement('div');
    puzzleContainer.id = 'puzzleContainer';
    puzzleContainer.style.position = 'relative'; // Set the position of the puzzle container to relative
    document.getElementById('output').appendChild(puzzleContainer);
    
    const parentContainer = document.getElementById('wrapper');
    parentContainer.style.overflowX = 'auto';
    parentContainer.style.overscrollBehavior = 'contain'; // stop pull-to-refresh while dragging/panning on mobile
    
    // Create the image. src is set LAST (see resolveJiggyImage below the onload) so that for mod
    // images we measure the real blob, not the lazy-load placeholder.
    const puzzlePicture = new Image();

    puzzlePicture.onload = function () {
        // ---- Board sizing (rewritten) ----
        // Use the image's REAL aspect ratio. The old code forced every image into one of a few
        // canonical boxes (square/landscape/wide/...) — THAT was what squashed pictures. Now the board
        // keeps the true aspect, pieces come out ~square, and integer piece sizes keep the snap/lock
        // grid intact. Priorities (high->low): correct aspect > no tiny pieces > no edge bleed >
        // varied cluster shapes > fits on screen > exact piece count.
        var natW = puzzlePicture.naturalWidth || puzzlePicture.width || 1024;
        var natH = puzzlePicture.naturalHeight || puzzlePicture.height || 1024;
        var imgAspect = natW / natH;

        var target = Number(totalPieces) || 50;
        // Grid matched to the image aspect (cols/rows ~ imgAspect) so pieces are as square as the
        // count allows. Exact count is the lowest priority, so we let it drift here.
        piecesPerColumn = Math.max(1, Math.round(Math.sqrt(target / imgAspect))); // rows
        piecesPerRow    = Math.max(1, Math.round(target / piecesPerColumn));      // cols
        totalPieces = piecesPerRow * piecesPerColumn;

        // Board at the CORRECT aspect, sized so pieces stay grabbable (no tiny pieces ranks above
        // fits-on-screen). Fit the board to ~85% of the play area when that keeps pieces big enough;
        // otherwise grow it (board overflows -> scroll/zoom) so pieces never get tiny.
        var portrait = window.matchMedia('(orientation: portrait)').matches;
        var wrapEl = document.getElementById('wrapper');
        var availW = (wrapEl && wrapEl.clientWidth) ? wrapEl.clientWidth : window.innerWidth;
        var availH = (wrapEl && wrapEl.clientHeight) ? wrapEl.clientHeight : window.innerHeight;
        var vmin = Math.min(window.innerWidth, window.innerHeight);
        var minPiece = Math.max(30, vmin * 0.07);            // comfortable touch target
        var maxPiece = Math.max(minPiece + 10, vmin * 0.22);

        // Per-orientation size trim (from device testing): landscape ~80% of fit; portrait wide ~80%,
        // portrait TALL ~60% (tall images ran large on a phone). minPiece below still guards the floor.
        var sizeFactor = 0.8;
        if (portrait && imgAspect < 1) sizeFactor = 0.6;
        var fitFraction = 0.85 * sizeFactor;
        var fitBoardW = Math.min(availW * fitFraction, availH * fitFraction * imgAspect);
        var fitBoardH = fitBoardW / imgAspect;
        var minDim = Math.min(fitBoardW / piecesPerRow, fitBoardH / piecesPerColumn);
        var k = 1;
        if (minDim < minPiece) k = minPiece / minDim;        // grow so pieces stay grabbable
        else if (minDim > maxPiece) k = maxPiece / minDim;   // shrink so pieces aren't huge
        var boardW = fitBoardW * k;
        var boardH = fitBoardH * k;

        // Integer pieces (the snap/lock grid relies on offsetWidth == pieceWidth). backgroundSize uses
        // the integer grid total below, so right/bottom edges still line up (no edge bleed).
        const pieceWidth = Math.max(1, Math.round(boardW / piecesPerRow));
        const pieceHeight = Math.max(1, Math.round(boardH / piecesPerColumn));
        jiggyPieceLayoutSize = Math.min(pieceWidth, pieceHeight); // so fit-zoom never shrinks below min
        jiggyMinPieceDisplay = minPiece;

        // Container = room to scatter; cluster mode spreads a touch more, portrait is taller.
        var spread = checkFlag("player", "easyJiggy") ? 1.5 : 1.35;
        var containerWidth = Math.max(availW, pieceWidth * piecesPerRow * spread);
        var containerHeight = Math.max(availH, pieceHeight * piecesPerColumn * (portrait ? spread * 1.25 : spread));
        document.getElementById('puzzleContainer').style.width = `${Math.round(containerWidth)}px`;
        document.getElementById('puzzleContainer').style.height = `${Math.round(containerHeight)}px`;

        // Separate the image into pieces
        for (let i = 0; i < piecesPerRow * piecesPerColumn; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.style.width = `${pieceWidth}px`;
            piece.style.height = `${pieceHeight}px`;
            piece.style.backgroundImage = `url('${image}')`;
            // Size the background to the INTEGER piece-grid total (not the raw image size) so the
            // right/bottom edges line up exactly — fixes edge pieces sampling past the image and
            // wrapping the opposite edge. no-repeat stops any residual wrap.
            piece.style.backgroundSize = `${pieceWidth * piecesPerRow}px ${pieceHeight * piecesPerColumn}px`;
            piece.style.backgroundRepeat = 'no-repeat';
            piece.style.touchAction = 'none'; // dragging a piece must not scroll / pull-to-refresh

            // Add a property to keep track of which pieces this piece is locked with
            piece.lockedWith = [];

            // Calculate the row and column of the piece
            const row = Math.floor(i / piecesPerRow);
            const col = i % piecesPerRow;

            // Add an id to each piece
            piece.id = `piece-${i}`;

            // Check if the piece is on the edge
            if (col === 0) {
                piece.style.borderLeft = "2px solid red";
                console.log(row+","+col+"-Row 0");
            }
            if (col === piecesPerRow - 1) {
                piece.style.borderRight = "2px solid red";
                console.log(row+","+col+"-Row Max");
            }
            if (row === 0) {
                piece.style.borderTop = "2px solid red";
                console.log(row+","+col+"-Col 0");
            }
            if (row === piecesPerColumn - 1) {
                piece.style.borderBottom = "2px solid red";
                console.log(row+","+col+"-Col Max");
            }

            // Set the background position of the piece
            piece.style.backgroundPosition = `-${col * pieceWidth}px -${row * pieceHeight}px`;
            // Make the puzzle piece draggable, although they already are by default?
            piece.setAttribute('draggable', 'true');

            // Get the output div
            const outputDiv = document.getElementById('puzzleContainer');

            // Set the initial position of the piece relative to the output div
            piece.style.position = 'absolute';
            piece.style.left = `${piece.offsetLeft + outputDiv.offsetLeft}px`;
            piece.style.top = `${piece.offsetTop + outputDiv.offsetTop}px`;

            // Randomly select an even-numbered grid space that is not yet occupied and is not within the middle area
            let x, y;
            let attempts = -20;
            do {
                if (window.matchMedia('(orientation: portrait)').matches) {
                    var placeableRows = 200/pieceWidth
                    var placeableColumns = piecesPerColumn*2
                }
                else {
                    var placeableRows = Math.max(piecesPerRow,piecesPerColumn)*1
                    var placeableColumns = Math.max(piecesPerRow,piecesPerColumn)*1
                }
                x = Math.round(Math.random() * placeableRows);
                y = Math.round(Math.random() * placeableColumns);
                console.log("X: "+x+" Y:"+y)
                attempts++;
                if (attempts > totalPieces+5) {
                    console.error('No valid positions left for placing the piece.');
                    break;
                }
            } while (occupiedSpaces.includes(`${x},${y}`));
            
            // Update the piece's position to the selected grid space
            if (window.matchMedia('(orientation: portrait)').matches) {
                var startingDistance = 0;
            }
            else {
                var startingDistance = 216;
            }
            const unsnappedLeft = x * pieceWidth+startingDistance;
            const unsnappedTop = y * pieceHeight;
            console.log("Left: "+unsnappedLeft+" Top:"+unsnappedTop)
            const snappedLeft = Math.round(unsnappedLeft / pieceWidth) * pieceWidth;
            const snappedTop = Math.round(unsnappedTop / pieceHeight) * pieceHeight;
            console.log("Width: "+pieceWidth+" Height:"+pieceHeight)
            piece.style.left = `${Math.round(snappedLeft)}px`;
            piece.style.top = `${Math.round(snappedTop)}px`;
            console.log("SNAPPED");


            // Mark the selected grid space as occupied
            occupiedSpaces.push(`${x},${y}`);

            // In the mousedown event handler, start dragging the piece and any locked pieces
            piece.addEventListener('mousedown', function (event) {
                piece.isDragging = true;
                piece.startX = event.clientX;
                piece.startY = event.clientY;
                console.log(`Mousedown on piece ${piece.id}`);
                event.preventDefault();
            });

            // Enable mobile users to touch to pick up the piece
            piece.addEventListener('touchstart', function (event) {
                piece.isDragging = true;
                piece.startX = event.touches[0].clientX;
                piece.startY = event.touches[0].clientY;
                console.log(`Touchstart on piece ${piece.id}`);
                event.preventDefault();
            });
            
            document.getElementById('puzzleContainer').appendChild(piece);
        }
    }

    // Mod puzzle images come back from cleanupImage() as a lazy-load placeholder
    // ("images-webp/none.webp#<path>") while the blob loads from IndexedDB. That placeholder is
    // ~square, so measuring IT set the whole board's aspect (grid, piece size, backgroundSize) —
    // then repaintModImage later swapped only the pixels in, stretching the real (e.g. 2432x1664)
    // image into the square board. Resolve the real blob FIRST, point both the pieces and the
    // measured image at it, THEN trigger the onload above so natW/natH are the true dimensions.
    resolveJiggyImage(image, function (realImage) {
        image = realImage;              // pieces are created inside onload, which runs after this
        puzzlePicture.src = realImage;  // fires the onload above with the correct natW/natH
    });

    if (window.matchMedia('(orientation: portrait)').matches) {
        writeHTML(`button Zoom in; zoomIn();`);
        writeHTML(`button Zoom out; zoomOut();`);
        
    }
	writeHTML(`button Back; killJiggy();`);
    getGridSizeSafe(({ w, h }) => {
        hideJiggyLoading();
        startupCheck();
    });

};

// Turn a cleanupImage() result into a directly-loadable URL BEFORE the puzzle measures it.
// Normal images pass straight through. Mod images arrive as a "none.webp#<path>" placeholder while
// their blob loads from IndexedDB; measuring that ~square placeholder is what squished wide mod
// puzzles. Poll modImages until the real blob lands, then hand it back.
function resolveJiggyImage(img, callback) {
    if (typeof img !== "string" || img.indexOf("none.webp#") === -1) {
        callback(img); // not a deferred mod image — already loadable
        return;
    }
    var markerPath;
    try {
        markerPath = decodeURIComponent(img.split("none.webp#").pop());
    } catch (e) {
        callback(img); // malformed marker — load it as-is rather than hang
        return;
    }
    var startedAt = Date.now();
    (function poll() {
        var resolved = window.modImages && window.modImages[markerPath];
        if (resolved && resolved !== "not_found") {
            callback(resolved); // real blob URL is ready
            return;
        }
        // Record is genuinely missing, or we've waited too long: fall back to the blank image so the
        // board is built at a sane aspect instead of spinning forever.
        if (resolved === "not_found" || Date.now() - startedAt > 8000) {
            callback(cleanupImage("none"));
            return;
        }
        // cleanupImage already kicks off the fetch, but be defensive in case it hasn't.
        if (window.knownModFiles && window.knownModFiles.has(markerPath) &&
            (!window.loadingStatus || window.loadingStatus[markerPath] !== "fetching")) {
            lazyLoadModImage(markerPath);
        }
        setTimeout(poll, 50);
    })();
}

function showJiggyLoading(text = "Preparing puzzle…") {
    let overlay = document.getElementById("jiggyLoading");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "jiggyLoading";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.background = "rgba(0, 0, 0, 0.6)";
        overlay.style.color = "#fff";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.fontSize = "var(--fs-large, 24px)";
        overlay.style.zIndex = "9999";
        overlay.style.pointerEvents = "none";

        document.body.appendChild(overlay);
    }

    overlay.textContent = text;
    overlay.style.display = "flex";
}

function hideJiggyLoading() {
    const overlay = document.getElementById("jiggyLoading");
    if (overlay) overlay.style.display = "none";
}

function startupCheck() {
    //Snap any pieces that are already adjacent
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        piece.isDragging = false;

        // Get the grid size dynamically
        const gridWidth = piece.offsetWidth;
        const gridHeight = piece.offsetHeight;

        // Snap the piece and all locked pieces to the grid
        snapPieceAndLockedPieces(piece, gridWidth, gridHeight);
        console.log(gridHeight)

        //Search for any adjacent pieces
        for (const piece of document.getElementsByClassName('puzzle-piece')) {
            checkForLocks(piece, gridWidth, gridHeight)
        }
    }
    if (checkFlag("player", "easyJiggy")) {
        const bucketSize = jiggyPieceSize;
        autoAssembleBuckets(bucketSize, function () {
            scatterClusters();      // random, bounded spread of the freshly-built clusters
            fitJiggyToViewport();   // zoom so the whole (now larger) board is visible
            armJiggySwap();         // only start counting swaps AFTER the opening combine
        });
    }
    else {
        fitJiggyToViewport();   // hard mode: fit the board to the screen too
        armJiggySwap();         // arm now; the opening locks become the baseline
    }
}

// In the mousemove event handler, if a piece is being dragged, move it and all locked pieces
document.addEventListener('mousemove', function (event) {
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        if (piece.isDragging) {
            const dx = event.clientX - piece.startX;
            const dy = event.clientY - piece.startY;

            movePieceAndLockedPieces(piece, dx, dy);

            // Update the startX and startY values
            piece.startX = event.clientX;
            piece.startY = event.clientY;
        }
    }
});

function getGridSizeSafe(callback) {
    const pieces = document.getElementsByClassName('puzzle-piece');

    if (!pieces.length) {
        requestAnimationFrame(() => getGridSizeSafe(callback));
        return;
    }

    const piece = pieces[0];

    if (piece.offsetWidth === 0 || piece.offsetHeight === 0) {
        requestAnimationFrame(() => getGridSizeSafe(callback));
        return;
    }

    callback({
        w: piece.offsetWidth,
        h: piece.offsetHeight
    });
}

function getGridSize() {
    const anyPiece = document.getElementsByClassName('puzzle-piece')[0];
    //If finding anypiece fails, retry in a second
    if (!anyPiece) {
    setTimeout(getGridSize, 1000);
}
    return {
        w: anyPiece.offsetWidth,
        h: anyPiece.offsetHeight
    };
}


function getAdjacency(id) {
    const adj = [];
    if (id % piecesPerRow !== 0) adj.push(id - 1); // left
    if (id % piecesPerRow !== piecesPerRow - 1) adj.push(id + 1); // right
    if (id >= piecesPerRow) adj.push(id - piecesPerRow); // top
    if (id < piecesPerRow * (piecesPerColumn - 1)) adj.push(id + piecesPerRow); // bottom
    return adj;
}

function getBucketAdjacency(bucket) {
    const set = new Set(bucket);
    const adj = {};

    for (const id of bucket) {
        adj[id] = getAdjacency(id).filter(n => set.has(n));
    }

    return adj;
}


var jiggyMinCluster = 4; // no clusters smaller than this (1-3 piece clusters were a mobile pain)

function buildBuckets(bucketSize) {
    const total = piecesPerRow * piecesPerColumn;
    const unused = new Set(Array.from({ length: total }, (_, i) => i));
    const minSize = Math.max(2, Math.min(jiggyMinCluster, Math.floor(total / 2)));
    const buckets = [];

    while (unused.size > 0) {
        const bucket = [];
        // Random seed (not always the lowest index) → clusters appear all over, not top-left first.
        const pool = Array.from(unused);
        const start = pool[Math.floor(Math.random() * pool.length)];
        unused.delete(start);
        bucket.push(start);

        let frontier = [start];
        // Varied target size around bucketSize → interesting, non-uniform clusters.
        const targetSize = Math.max(minSize, Math.round(bucketSize * (0.6 + Math.random() * 0.9)));

        while (bucket.length < targetSize && frontier.length > 0) {
            // Pull a RANDOM frontier cell (not strict FIFO) and shuffle its neighbours → less blobby,
            // more varied cluster shapes.
            const fi = Math.floor(Math.random() * frontier.length);
            const current = frontier.splice(fi, 1)[0];
            const neighbors = getAdjacency(current);
            for (let s = neighbors.length - 1; s > 0; s--) {
                const r = Math.floor(Math.random() * (s + 1));
                const tmp = neighbors[s]; neighbors[s] = neighbors[r]; neighbors[r] = tmp;
            }
            for (const adj of neighbors) {
                if (unused.has(adj)) {
                    unused.delete(adj);
                    bucket.push(adj);
                    frontier.push(adj);
                    if (bucket.length >= targetSize) break;
                }
            }
        }

        buckets.push(bucket);
    }

    mergeTinyBuckets(buckets, minSize);
    return buckets;
}

function mergeTinyBuckets(buckets, minSize) {
    // Fold any below-minimum bucket into an adjacent one so there are no 1-3 piece clusters. Merging
    // into a neighbour keeps each bucket contiguous (so autoAssembleBucket still assembles cleanly).
    function indexMap() {
        const m = {};
        for (let b = 0; b < buckets.length; b++) for (const id of buckets[b]) m[id] = b;
        return m;
    }
    let changed = true;
    while (changed) {
        changed = false;
        const m = indexMap();
        for (let b = 0; b < buckets.length; b++) {
            if (buckets[b].length === 0 || buckets[b].length >= minSize) continue;
            let target = -1;
            for (const id of buckets[b]) {
                for (const adj of getAdjacency(id)) {
                    const ob = m[adj];
                    if (ob !== undefined && ob !== b && buckets[ob].length > 0) { target = ob; break; }
                }
                if (target !== -1) break;
            }
            if (target !== -1) {
                buckets[target] = buckets[target].concat(buckets[b]);
                buckets[b] = [];
                changed = true;
            }
        }
    }
    for (let b = buckets.length - 1; b >= 0; b--) if (buckets[b].length === 0) buckets.splice(b, 1);
}
function autoAssembleBucket(bucket) {
    const adj = getBucketAdjacency(bucket);
    const assembled = new Set();

    const seed = bucket[Math.floor(Math.random() * bucket.length)];
    assembled.add(seed);

    const { w, h } = getGridSize();

    while (assembled.size < bucket.length) {
        // Find an unassembled piece that borders an assembled one
        let next = null;
        let base = null;

        for (const a of assembled) {
            for (const n of adj[a]) {
                if (!assembled.has(n)) {
                    base = document.getElementById(`piece-${a}`);
                    next = document.getElementById(`piece-${n}`);
                    assembled.add(n);
                    break;
                }
            }
            if (next) break;
        }

        if (!next) break; // safety

        placeAdjacentCorrectly(base, next);
        snapPieceAndLockedPieces(next, w, h);
        checkForLocks(base, w, h);
        checkForLocks(next, w, h);
    }
}


function autoAssembleBuckets(bucketSize, onComplete) {
    const buckets = buildBuckets(bucketSize);
    let index = 0;

    function step() {
        if (index >= buckets.length) {
            if (typeof onComplete === "function") onComplete();
            return;
        }
        autoAssembleBucket(buckets[index]);
        index++;
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}




function getLockedCluster(piece, visited = new Set()) {
    if (visited.has(piece.id)) return visited;
    visited.add(piece.id);

    for (const id of piece.lockedWith) {
        const p = document.getElementById(id);
        if (p) getLockedCluster(p, visited);
    }

    return visited;
}

function moveClusterBy(piece, dx, dy) {
    const cluster = getLockedCluster(piece);

    for (const id of cluster) {
        const p = document.getElementById(id);
        p.style.left = `${parseInt(p.style.left) + dx}px`;
        p.style.top  = `${parseInt(p.style.top) + dy}px`;
    }
}



// Add a touch move event handler for mobile users
document.addEventListener('touchmove', function (event) {
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        if (piece.isDragging) {
            console.log("Touchmove")
            const dx = event.touches[0].clientX - piece.startX;
            const dy = event.touches[0].clientY - piece.startY;

            movePieceAndLockedPieces(piece, dx, dy);

            // Update the startX and startY values
            piece.startX = event.touches[0].clientX;
            piece.startY = event.touches[0].clientY;
        }
    }
});

addEventListener("wheel", (event) => {
    let scrollDistance = event.deltaY;

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    if (wrapper.scrollTop === 0 && scrollDistance < 0) {
        scrollDistance = 0;
    }

    console.log(`Scrolled ${scrollDistance} pixels vertically`);

    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        if (piece.isDragging) {
            const dx = event.clientX - piece.startX;
            const dy = event.clientY - piece.startY;
            movePieceAndLockedPieces(piece, dx, dy+scrollDistance);
        }
    }
});

// Recursive function to move a piece and all pieces locked with it
function movePieceAndLockedPieces(piece, dx, dy, movedPieces = new Set()) {
    // If the piece has already been moved, don't move it again
    if (movedPieces.has(piece.id)) return;

    // Adjust the movement for the current scale
    let neox = dx / scale;
    let neoy = dy / scale;

    piece.style.left = `${Math.round((parseInt(piece.style.left) || 0) + neox)}px`;
    piece.style.top = `${Math.round((parseInt(piece.style.top) || 0) + neoy)}px`;

    // Add the piece to the set of moved pieces
    movedPieces.add(piece.id);

    for (const lockedPieceId of piece.lockedWith) {
        const lockedPiece = document.getElementById(lockedPieceId);
        movePieceAndLockedPieces(lockedPiece, dx, dy, movedPieces);
    }
    wrapperDifference = 0;
}

function autoAssembleInBatches(iterations, batchSize = 1) {
    let i = 0;

    function step() {
        let count = 0;
        while (count < batchSize && i < iterations) {
            automovePieceAndLockedPieces();
            count++;
            i++;
        }

        if (i < iterations) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function getRandomPieceWithOpenNeighbor() {
    const pieces = Array.from(document.getElementsByClassName('puzzle-piece'));

    for (let attempt = 0; attempt < 100; attempt++) {
        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        const id = parseInt(piece.id.split('-')[1]);

        const neighbors = {
            left:  id % piecesPerRow === 0 ? null : id - 1,
            right: id % piecesPerRow === piecesPerRow - 1 ? null : id + 1,
            top:   id < piecesPerRow ? null : id - piecesPerRow,
            bottom:id >= piecesPerRow * (piecesPerColumn - 1) ? null : id + piecesPerRow
        };

        for (const adjId of Object.values(neighbors)) {
            if (adjId === null) continue;
            const adjPiece = document.getElementById(`piece-${adjId}`);
            if (!piece.lockedWith.includes(adjPiece.id)) {
                return { piece, adjPiece, adjId };
            }
        }
    }

    return null;
}

function placeAdjacentCorrectly(basePiece, targetPiece) {
    const baseId = parseInt(basePiece.id.split('-')[1]);
    const targetId = parseInt(targetPiece.id.split('-')[1]);
    const { w, h } = getGridSize();

    const baseLeft = parseInt(basePiece.style.left);
    const baseTop  = parseInt(basePiece.style.top);

    let desiredLeft = baseLeft;
    let desiredTop  = baseTop;

    if (targetId === baseId - 1) desiredLeft -= w;
    else if (targetId === baseId + 1) desiredLeft += w;
    else if (targetId === baseId - piecesPerRow) desiredTop -= h;
    else if (targetId === baseId + piecesPerRow) desiredTop += h;

    const currentLeft = parseInt(targetPiece.style.left);
    const currentTop  = parseInt(targetPiece.style.top);

    const dx = desiredLeft - currentLeft;
    const dy = desiredTop  - currentTop;

    moveClusterBy(targetPiece, dx, dy);
}


function automovePieceAndLockedPieces() {
    const result = getRandomPieceWithOpenNeighbor();
    if (!result) return;

    const { piece, adjPiece } = result;
    const { w, h } = getGridSize();

    placeAdjacentCorrectly(piece, adjPiece);

    snapPieceAndLockedPieces(adjPiece, w, h);
    checkForLocks(piece, w, h);
    checkForLocks(adjPiece, w, h);
}


// Recursive function to snap a piece and all pieces locked with it to the grid
function snapPieceAndLockedPieces(piece, gridWidth, gridHeight, snappedPieces = new Set()) {
    // If the piece has already been snapped, don't snap it again
    if (snappedPieces.has(piece.id)) return;

    let left = parseInt(piece.style.left);
    let top = parseInt(piece.style.top);

    // Adjust the grid size for the current scale
    let neoWidth = gridWidth;
    let neoHeight = gridHeight;

    const snappedLeft = Math.round(left / neoWidth) * neoWidth;
    const snappedTop = Math.round(top / neoHeight) * neoHeight;
    console.log(snappedLeft)
    piece.style.left = `${Math.round(snappedLeft)}px`;
    piece.style.top = `${Math.round(snappedTop)}px`;

    // Add the piece to the set of snapped pieces
    snappedPieces.add(piece.id);

    for (const lockedPieceId of piece.lockedWith) {
        const lockedPiece = document.getElementById(lockedPieceId);
        snapPieceAndLockedPieces(lockedPiece, gridWidth, gridHeight, snappedPieces);
    }
}

// Function to check if two pieces are adjacent
function isAdjacent(piece1, piece2, gridWidth, gridHeight) {
    const left1 = parseInt(piece1.style.left);
    const top1 = parseInt(piece1.style.top);
    const left2 = parseInt(piece2.style.left);
    const top2 = parseInt(piece2.style.top);

    const isHorizontallyAdjacent = Math.abs(left1 - left2) <= gridWidth && top1 === top2;
    const isVerticallyAdjacent = Math.abs(top1 - top2) <= gridHeight && left1 === left2;

    return isHorizontallyAdjacent || isVerticallyAdjacent;
}

// In the mouseup event handler, stop dragging the piece and lock it with any adjacent pieces
document.addEventListener('mouseup', function (event) {
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        if (piece.isDragging) {
            piece.isDragging = false;
            console.log(`Mouseup on piece ${piece.id}`);

            // Get the grid size dynamically
            const gridWidth = piece.offsetWidth;
            const gridHeight = piece.offsetHeight;

            // Snap the piece and all locked pieces to the grid
            snapPieceAndLockedPieces(piece, gridWidth, gridHeight);
            console.log(gridHeight)

            //Search for any adjacent pieces
            for (const piece of document.getElementsByClassName('puzzle-piece')) {
                checkForLocks(piece, gridWidth, gridHeight)
            }
        }
    }

    updateJiggySwap();
    if (document.getElementById('piece-1')) {
        if (checkWin() == true) {
            console.log("VICTORY");

            if (randomJiggy != true) {
                addFlag("player", currentJiggy);
            }
            else {
                if (data.player.randomJiggyScore) {
                    data.player.randomJiggyScore += 1;
                }
                else {
                    data.player.randomJiggyScore = 1;
                }
            }
            jiggyWin(currentImage);
        }
    }
});

// Add a touch stop event handler for mobile users.
document.addEventListener('touchend', function (event) {
    console.log("Touchend")
    for (const piece of document.getElementsByClassName('puzzle-piece')) {
        if (piece.isDragging) {
            piece.isDragging = false;
            console.log(`Mouseup on piece ${piece.id}`);

            // Get the grid size dynamically
            const gridWidth = piece.offsetWidth;
            const gridHeight = piece.offsetHeight;

            // Snap the piece and all locked pieces to the grid
            snapPieceAndLockedPieces(piece, gridWidth, gridHeight);
            console.log(gridHeight)

            //Search for any adjacent pieces
            for (const piece of document.getElementsByClassName('puzzle-piece')) {
                checkForLocks(piece, gridWidth, gridHeight)
            }
        }
    }

    updateJiggySwap();
    if (document.getElementById('piece-1')) {
        if (checkWin() == true) {
            console.log("VICTORY");
            // Mirror the mouseup handler: random jiggies must NOT addFlag — currentJiggy
            // holds a cleaned image value for those (for mod images a session-only blob:
            // URL), which touch wins used to write into the save as a junk flag. Random
            // wins count toward randomJiggyScore instead (touch never got credit before).
            if (randomJiggy != true) {
                addFlag("player", currentJiggy);
            }
            else {
                if (data.player.randomJiggyScore) {
                    data.player.randomJiggyScore += 1;
                }
                else {
                    data.player.randomJiggyScore = 1;
                }
            }
            jiggyWin(currentImage);
            saveSlot(10);
        }
    }
});

function checkForLocks(piece, gridWidth, gridHeight) {
    // Calculate the piece's ID number and its adjacent IDs
    const pieceIdNumber = parseInt(piece.id.split('-')[1]);
    const adjacentIds = {
        left: pieceIdNumber % piecesPerRow === 0 ? null : pieceIdNumber - 1,
        right: pieceIdNumber % piecesPerRow === piecesPerRow - 1 ? null : pieceIdNumber + 1,
        top: pieceIdNumber < piecesPerRow ? null : pieceIdNumber - piecesPerRow,
        bottom: pieceIdNumber >= piecesPerRow * (piecesPerColumn - 1) ? null : pieceIdNumber + piecesPerRow
    };

    // Define the left and top positions of the current piece
    const left = parseInt(piece.style.left);
    const top = parseInt(piece.style.top);

    // Check if the piece is close to any of its adjacent pieces
    for (const [position, adjacentId] of Object.entries(adjacentIds)) {
        const adjacentPiece = document.getElementById(`piece-${adjacentId}`);
    
        // If the adjacent piece doesn't exist or is not adjacent, skip to the next one
        if (!adjacentPiece || !isAdjacent(piece, adjacentPiece, gridWidth, gridHeight)) continue;
    
        // Get the left and top positions of the adjacent piece
        const adjacentLeft = parseInt(adjacentPiece.style.left);
        const adjacentTop = parseInt(adjacentPiece.style.top);
    
        // Check the relative position of the adjacent piece
        let isCorrectPosition;
        switch (position) {
            case 'left':
                isCorrectPosition = adjacentLeft < left;
                break;
            case 'right':
                isCorrectPosition = adjacentLeft > left;
                break;
            case 'top':
                isCorrectPosition = adjacentTop < top;
                break;
            case 'bottom':
                isCorrectPosition = adjacentTop > top;
                break;
        }

        // If the pieces are close to each other and in the correct position, lock them together
        if (isCorrectPosition && Math.abs(left - adjacentLeft) <= piece.offsetWidth && Math.abs(top - adjacentTop) <= piece.offsetHeight) {
            // Check if the pieces are already locked together
            if (!piece.lockedWith.includes(adjacentPiece.id)) {
                piece.lockedWith.push(adjacentPiece.id);
                adjacentPiece.lockedWith.push(piece.id);
                console.log(`Locked piece ${piece.id} with piece ${adjacentPiece.id}`);
                soundEffectStart("button");
                jiggyLinkCount++; // one count per unique pair (next pass sees them already locked)
            }
        }
    }
}

let scale = 1;

function zoomIn() {
    scale += 0.1;
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.style.transformOrigin = '0 0';
    puzzleContainer.style.transform = `scale(${scale})`;
}

function zoomOut() {
    scale -= 0.1;
    const puzzleContainer = document.getElementById('puzzleContainer');
    puzzleContainer.style.transformOrigin = '0 0';
    puzzleContainer.style.transform = `scale(${scale})`;
}

function checkWin() {
    const pieces = document.getElementsByClassName('puzzle-piece');
    for (const piece of pieces) {
        const pieceIdNumber = parseInt(piece.id.split('-')[1]);
        const isEdgePiece = pieceIdNumber % piecesPerRow === 0 || pieceIdNumber % piecesPerRow === piecesPerRow - 1 || pieceIdNumber < piecesPerRow || pieceIdNumber >= piecesPerRow * (piecesPerColumn - 1);
        const isCornerPiece = (pieceIdNumber === 0) || (pieceIdNumber === piecesPerRow - 1) || (pieceIdNumber === piecesPerRow * (piecesPerColumn - 1)) || (pieceIdNumber === piecesPerRow * piecesPerColumn - 1);
        const expectedAdjacentPieces = isCornerPiece ? 2 : isEdgePiece ? 3 : 4;
        if (piece.lockedWith.length !== expectedAdjacentPieces) {
            return false;
        }
    }
    return true;
}

//Returns the winImages list from the jiggy collectable whose index is ref, or an empty list.
//The list holds logical image paths, which are cleaned when they are shown.
function getJiggyWinImages(ref) {
    if (typeof globalCollectablesArray === "undefined" || !ref) return [];
    for (var i = 0; i < globalCollectablesArray.length; i++) {
        var entry = globalCollectablesArray[i];
        if (entry && entry.category === "jiggy" && entry.index === ref && Array.isArray(entry.winImages)) {
            return entry.winImages;
        }
    }
    return [];
}

function jiggyWin(image) {
	soundEffectStart("purchase");
	wrapper.scrollTop = 0;
	document.getElementById('output').innerHTML = '';
    // Mid-game-swap jiggies: show the base image; clicking it cycles through the stages.
    // The stored [0] may be a stale lazy-load marker while cleanupImage(image) now returns the
    // materialized blob URL — re-clean the stored side too so the comparison doesn't miss.
    var _rewardSeq = null;
    if (jiggyRewardSequence && jiggyRewardSequence.length >= 2 && cleanupImage(jiggyRewardSequence[0]) === cleanupImage(image)) {
        _rewardSeq = jiggyRewardSequence; // from the puzzle we just played (incl. console tests)
    }
    else {
        var _winCfg = getJiggySwapConfig(image);
        if (_winCfg.swapImages && _winCfg.swapImages.length > 0) {
            _rewardSeq = [cleanupImage(image)].concat(_winCfg.swapImages.map(function (s) { return cleanupImage(s); }));
        }
    }
    if (_rewardSeq) {
        jiggyRewardSequence = _rewardSeq;
        jiggyRewardIndex = 0;
        // A swap may have fired on the winning link, so force the backdrop back to the base image.
        var _bg = document.getElementById('wrapperBG');
        if (_bg) _bg.style.backgroundImage = "url(" + cleanupImage(image) + ")";
        document.getElementById('output').innerHTML += `
            <img id="jiggyRewardImage" class="bigPicture" src="` + cleanupImage(image) + `"
            onclick="cycleJiggyReward(this)"
            style="filter:brightness(100%); max-width: 100vw; max-height:100vh; cursor:pointer;">
        `;
        HTMLContainer = "output";
        writeText("Try clicking the image!", "centered");
    }
    else if (getJiggyWinImages(currentJiggy).length > 0) {
        //The jiggy's collectable entry lists the pictures to show once it is finished, in winImages.
        //The doax jiggies list the six pictures each puzzle was made from.
        var _winImages = getJiggyWinImages(currentJiggy);
        for (var _winIndex = 0; _winIndex < _winImages.length; _winIndex++) {
            document.getElementById('output').innerHTML += `
                <img class="bigPicture" src="` + cleanupImage(_winImages[_winIndex]) + `"
                onclick="killJiggy()",
                style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
            `;
        }
    }
    else if (image.includes("Fused3")) {
        var imgSrc = cleanupImage(image.replace("Fused3", "-1"));
        document.getElementById('output').innerHTML += `
            <img class="bigPicture" src="` + cleanupImage(imgSrc) + `"
            onclick="killJiggy()",
            style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
        `;
        imgSrc = image.replace("Fused3", "-2");
        document.getElementById('output').innerHTML += `
            <img class="bigPicture" src="` + cleanupImage(imgSrc) + `"
            onclick="killJiggy()",
            style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
        `;
        imgSrc = image.replace("Fused3", "-3");
        document.getElementById('output').innerHTML += `
            <img class="bigPicture" src="` + cleanupImage(imgSrc) + `"
            onclick="killJiggy()",
            style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
        `;
    }
    else {
        document.getElementById('output').innerHTML += `
            <img class="bigPicture" src="` + cleanupImage(image) + `"
            onclick="killJiggy()",
            style="filter:brightness(100%); max-width: 100vw; max-height:100vh;">
        `;
    }
	writeHTML(`button You did it!; killJiggy();`);
}
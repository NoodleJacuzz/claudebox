//Libraries of misc prompts
var miscDB = `

belt pouch: pouch;
thick thighs: thighs;

generic variants:
color
gradient
size
count
shape
glow

deco variants:
ring(s)
ribbon(s)
bow(s)

trim variants:
fluff

Special things to handle:
-(generic): Assign all generic variants
-(deco): Assign all decoration variants, as well as decoration colors and decoration shapes
(s) or (e) or (es): Handle single and plural
(own): Handle "own", "another's", and null


body
    body-meta
        character
        identity
        species
    body-part
        skin
        fur
        markings
        racial
        shape
        head
            halo
                -(generic)
            horn(s)
                -(generic)
                -(deco)
                antlers
                antenna(e)
            crest
                -(generic)
            head wing(s)
            head fin(s)
            ear(s)
            hair
                highlight
            face
                -upper
                    forehead
                    bangs
                    forelocks
                    orbital
                        eyebrows
                        eyelashes
                        eyeshadow
                        wrinkles
                        eye(s)
                            sclera
                            pupils
                cheeks
                    whiskers
                    cheek sticker
                nose
                -lower
                    jaw
                        muzzle
                            lips
                                fang(s)
                                teeth
                                    tongue
        torso
            -upper
                neck
                shoulder(s)
                    armpit(s)
                    altarms
                    arm(s)
                        bicep(s)
                            forearm(s)
                                wrist(s)
                                    hand(s)
                                        finger(s)
                                            fingernail(s)
            -front
                chest
                    pectorals
                    breasts
                        areolas
                            nipples
            -back
                back
                    back wing(s)
        midsection
            hips
            -front
                belly
            -back
                hip wings
                tail
        waist
            balls
            waist-front
                pelvis
                womb
                penis(es)
                    shaft
                        glans
                pussy
                    clit
                    labia
            waist-back
                butt
                    anus
        leg(s)
            thighs
                knees
                    calves
                        ankles
                            feet
                                heels
                                soles
                                hooves
                                toes
                                    toenails
        altlegs
    body-action
clothes
    clothes-meta
        outfit
        armor
        swimwear
        pajamas
    clothes-wear
        fullwear
            bikini
            swimsuit
            leotard
            dress
            robe
            kimono
            bodysuit
            sheet
            towel
        headwear
            facewear
                foreheadwear
                eyewear
                mouthwear
            earwear
    clothes-action
accessories
    accessories-wear
    accessories-action
scene
    scene-action
    scene-object
    scene-background
`
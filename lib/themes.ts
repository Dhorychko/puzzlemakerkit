// Curated word lists for themed bingo and word search pages, and clue sets for crosswords.
import type { Entry } from "./puzzles.ts";

export type Theme = { slug: string; name: string; bingo?: string[]; words?: string[] };

export const THEMES: Theme[] = [
  { slug: "christmas", name: "Christmas",
    bingo: ["Santa", "Reindeer", "Snowman", "Candy Cane", "Stocking", "Mistletoe", "Gingerbread", "Ornament", "Elf", "Sleigh", "Wreath", "Star", "Presents", "Hot Cocoa", "Jingle Bells", "Christmas Tree", "Snowflake", "North Pole", "Holly", "Angel", "Cookies", "Nutcracker", "Garland", "Chimney", "Rudolph", "Mittens", "Candle", "Bow", "Snow Globe", "Gift Wrap", "Carolers", "Fireplace", "Sugar Cookie", "Toy Shop", "Scarf", "Sled", "Twinkle Lights", "Polar Bear", "Penguin", "Bells"],
    words: ["SANTA", "REINDEER", "SNOWMAN", "STOCKING", "MISTLETOE", "ORNAMENT", "SLEIGH", "WREATH", "PRESENTS", "ELVES", "CANDY CANE", "GINGERBREAD", "TINSEL", "CAROLS", "JINGLE", "HOLLY", "NORTH POLE", "CHIMNEY", "COOKIES", "ANGEL"] },
  { slug: "thanksgiving", name: "Thanksgiving",
    bingo: ["Turkey", "Pumpkin Pie", "Cranberry Sauce", "Stuffing", "Mashed Potatoes", "Gravy", "Corn", "Pilgrim", "Mayflower", "Football", "Parade", "Family", "Thankful", "Leaves", "Acorn", "Cornucopia", "Sweet Potato", "Rolls", "Wishbone", "Apple Cider", "Harvest", "Scarecrow", "Pecan Pie", "Green Beans", "Gratitude", "Feast", "Turkey Hat", "Hayride", "Apple Pie", "Corn Bread", "Cranberries", "Oven Mitt", "Napkins", "Table", "Grandma", "Nap", "Pie Crust", "Pumpkin", "Gobble"],
    words: ["TURKEY", "PILGRIM", "HARVEST", "PUMPKIN", "CRANBERRY", "STUFFING", "GRAVY", "MAYFLOWER", "THANKFUL", "FEAST", "GOBBLE", "PIE", "FAMILY", "AUTUMN", "POTATOES", "CORNUCOPIA", "PARADE", "GRATITUDE", "ACORN", "WISHBONE"] },
  { slug: "halloween", name: "Halloween",
    bingo: ["Pumpkin", "Ghost", "Witch", "Black Cat", "Bat", "Spider", "Candy Corn", "Skeleton", "Haunted House", "Broom", "Jack-o'-Lantern", "Mummy", "Zombie", "Costume", "Trick or Treat", "Full Moon", "Cauldron", "Spider Web", "Vampire", "Owl", "Scarecrow", "Candy Bag", "Tombstone", "Monster", "Werewolf", "Haystack", "Flashlight", "Wizard", "Pirate", "Princess", "Superhero", "Lollipop", "Chocolate Bar", "Doorbell", "Porch Light", "Raven", "Crow", "Hay Bale", "Caramel Apple", "Graveyard"],
    words: ["PUMPKIN", "GHOST", "WITCH", "SKELETON", "VAMPIRE", "MUMMY", "ZOMBIE", "COSTUME", "CANDY", "SPIDER", "BROOMSTICK", "CAULDRON", "BAT", "HAUNTED", "LANTERN", "MONSTER", "COBWEB", "TOMBSTONE", "SPOOKY", "OWL"] },
  { slug: "baby-shower", name: "Baby Shower",
    bingo: ["Diapers", "Bottle", "Onesie", "Pacifier", "Crib", "Stroller", "Bib", "Rattle", "Car Seat", "Baby Monitor", "Blanket", "Teddy Bear", "Booties", "Wipes", "Lotion", "Bath Tub", "High Chair", "Changing Pad", "Swaddle", "Socks", "Burp Cloth", "Books", "Hat", "Mobile", "Night Light", "Teether", "Baby Carrier", "Diaper Bag", "Bouncer", "Play Mat", "Crib Sheets", "Bottle Brush", "Bath Toys", "Hooded Towel", "Mittens", "Nursing Pillow", "Sippy Cup", "Board Book", "Bassinet", "Thermometer"] },
  { slug: "bridal-shower", name: "Bridal Shower",
    bingo: ["Kitchen Gadget", "Towels", "Wine Glasses", "Recipe Card", "Blender", "Picture Frame", "Candles", "Cookbook", "Gift Card", "Cutting Board", "Mixing Bowls", "Sheets", "Coffee Maker", "Mugs", "Plates", "Bow on Her Head", "Happy Tears", "Champagne", "Something Blue", "Dish Towels", "Spa Set", "Robe", "Jewelry Box", "Throw Pillow", "Wedding Album", "Apron", "Toaster", "Wine Opener", "Serving Bowl", "Bath Towels", "Measuring Cups", "Lingerie", "Photo Album", "Vase", "Salad Bowl", "Cheese Board", "Wine", "Bathrobe", "Dutch Oven", "Laughter"] },
  { slug: "easter", name: "Easter",
    bingo: ["Easter Egg", "Bunny", "Basket", "Chick", "Jelly Beans", "Chocolate Bunny", "Egg Hunt", "Lily", "Tulip", "Spring", "Lamb", "Carrots", "Grass", "Bonnet", "Duckling", "Marshmallow Chick", "Egg Dye", "Butterfly", "Daffodil", "Rainbow", "Brunch", "Hot Cross Bun", "Bow", "Flowers", "Picnic", "Peeps", "Egg Basket", "Paint Brush", "Chocolate Egg", "Plastic Egg", "Bunny Ears", "Sunrise", "Garden", "Pastel Colors", "Robin", "Nest", "Spring Dress", "Ham", "Baby Animals", "Umbrella"],
    words: ["BUNNY", "BASKET", "EGG HUNT", "CHICK", "JELLY BEANS", "CHOCOLATE", "SPRING", "LILY", "TULIP", "LAMB", "CARROT", "BONNET", "DUCKLING", "PASTEL", "SUNDAY", "DYE", "GRASS", "BLOSSOM", "HOP", "BUTTERFLY"] },
  { slug: "valentines", name: "Valentine's Day",
    bingo: ["Heart", "Rose", "Cupid", "Chocolate", "Love Letter", "Teddy Bear", "Kiss", "Hug", "Arrow", "Card", "Candy Hearts", "Red", "Pink", "Flowers", "Friendship", "Ring", "Cupcake", "Balloon", "Lollipop", "Dinner Date", "Be Mine", "XOXO", "Lace", "Lovebirds", "Sweetheart", "Candle", "Cookies", "Glitter", "Stickers", "Paper Heart", "Valentine Box", "Smile", "Best Friend", "Doily", "Sprinkles", "Red Bow", "Pink Frosting", "Love Song", "Kind Note", "Mailbox"],
    words: ["HEART", "ROSES", "CUPID", "CHOCOLATE", "VALENTINE", "BALLOONS", "KINDNESS", "ARROW", "CARD", "FLOWERS", "HUGS", "FRIENDSHIP", "LOVEBIRDS", "CANDY", "RED", "PINK", "FEBRUARY", "ADMIRE", "LACE", "SPRINKLES"] },
  { slug: "summer", name: "Summer",
    words: ["SUNSHINE", "BEACH", "OCEAN", "SANDCASTLE", "SWIMMING", "VACATION", "PICNIC", "CAMPING", "SUNSCREEN", "POPSICLE", "WATERMELON", "LEMONADE", "FIREWORKS", "SURFING", "HAMMOCK", "SEASHELL", "BARBECUE", "FLIP FLOPS", "SUNGLASSES", "POOL"] },
  { slug: "fall", name: "Fall",
    words: ["AUTUMN", "LEAVES", "ACORN", "PUMPKIN", "HARVEST", "SWEATER", "APPLES", "SCARECROW", "HAYRIDE", "CIDER", "SQUIRREL", "CORNSTALK", "FOOTBALL", "BONFIRE", "MAPLE", "ORCHARD", "RAKE", "CHESTNUT", "OCTOBER", "NOVEMBER"] },
  { slug: "spring", name: "Spring",
    words: ["BLOSSOM", "TULIP", "DAFFODIL", "RAINBOW", "BUTTERFLY", "GARDEN", "SPROUT", "PUDDLE", "UMBRELLA", "ROBIN", "NEST", "BLOOM", "SUNSHINE", "MEADOW", "BUMBLEBEE", "SEEDS", "KITE", "LADYBUG", "MARCH", "APRIL"] },
  { slug: "winter", name: "Winter",
    words: ["SNOWFLAKE", "BLIZZARD", "ICICLE", "SNOWMAN", "MITTENS", "SCARF", "SLED", "HOT COCOA", "FIREPLACE", "SKATING", "FROST", "PENGUIN", "IGLOO", "SKIING", "BOOTS", "JACKET", "CHILLY", "FREEZING", "JANUARY", "POLAR BEAR"] },
  { slug: "math", name: "Math",
    words: ["ADDITION", "SUBTRACT", "MULTIPLY", "DIVIDE", "FRACTION", "DECIMAL", "PERCENT", "EQUATION", "VARIABLE", "GEOMETRY", "SQUARE", "TRIANGLE", "CIRCLE", "RADIUS", "AREA", "VOLUME", "PERIMETER", "INTEGER", "SUM", "PRODUCT"] },
  { slug: "sports", name: "Sports",
    words: ["BASEBALL", "BASKETBALL", "FOOTBALL", "SOCCER", "HOCKEY", "TENNIS", "GOLF", "VOLLEYBALL", "SWIMMING", "TRACK", "WRESTLING", "LACROSSE", "SOFTBALL", "BOXING", "CYCLING", "GYMNASTICS", "SKIING", "BOWLING", "RUGBY", "ARCHERY"] },
  { slug: "animals", name: "Animals",
    words: ["ELEPHANT", "GIRAFFE", "LION", "TIGER", "ZEBRA", "KANGAROO", "PENGUIN", "DOLPHIN", "MONKEY", "GORILLA", "PANDA", "KOALA", "CHEETAH", "RHINO", "HIPPO", "CROCODILE", "OWL", "RABBIT", "SQUIRREL", "TURTLE"] },
];
export const THEME_BY_SLUG = Object.fromEntries(THEMES.map((t) => [t.slug, t])) as Record<string, Theme>;

export const KIDS_WORDS = ["CAT", "DOG", "SUN", "HAT", "BALL", "FISH", "BIRD", "TREE", "CAKE", "STAR", "FROG", "DUCK"];
export const LARGE_PRINT_WORDS = ["GARDEN", "COFFEE", "SUNSET", "FAMILY", "PICNIC", "MUSIC", "BOOKS", "TRAVEL", "FLOWERS", "OCEAN", "COOKIES", "PUZZLE", "SPRING", "WALKING", "FRIENDS"];
export const DEFAULT_CUSTOM = ["PUZZLE", "LETTERS", "SEARCH", "PENCIL", "HIDDEN", "DIAGONAL", "CIRCLE", "FIND", "WORDS", "GRID", "CLUE", "ANSWER"];

export const YEARLY_GOALS = [
  "Read 12 books", "Try a new recipe", "Walk 10,000 steps a day for a week", "Visit a new state", "Learn a new skill", "Call an old friend",
  "Go a week without social media", "Volunteer", "Watch a sunrise", "Plant something", "Take a class", "Save for a goal", "Go camping",
  "Try a new restaurant", "Write a letter", "Declutter a closet", "Run a 5K", "Visit a museum", "Cook a family recipe", "Learn 10 words in a new language",
  "Go to a concert", "Take a day trip", "Start a journal", "Do a random act of kindness", "Try a new hobby", "Drink more water", "Go to bed early for a week", "Have a picnic",
  "Swim in a lake or ocean", "Bake bread from scratch", "Finish a puzzle", "Go stargazing", "Learn a song", "Try yoga", "Visit a library", "Hike a new trail",
  "Unplug for a weekend", "Host a game night", "Send birthday cards", "Fix something yourself",
];

/** For a card made late in the year: short goals you can still finish before New Year's Eve. */
export const YEAR_END_GOALS = [
  "Read 2 more books", "Make a holiday playlist", "Bake cookies", "Write thank-you notes", "Watch the first snow", "Clean out the garage",
  "Donate old clothes", "See holiday lights", "Call grandparents", "Make a gift by hand", "Try a new soup recipe", "Go ice skating",
  "Have a movie marathon", "Take a family photo", "Volunteer at a food bank", "Plan next year's trip", "Go on a fall hike", "Carve a pumpkin",
  "Visit a farmers market", "Back up your photos", "Finish a project", "Host a dinner", "Write down 10 wins this year", "Get a flu shot", "Sleep in on a Sunday",
  "Make hot chocolate from scratch", "Try a new board game", "Organize your desk",
];

export type ClueSet = { slug: string; name: string; entries: Entry[] };
export const CLUE_SETS: ClueSet[] = [
  { slug: "animals", name: "Animals", entries: [
    { answer: "ELEPHANT", clue: "Largest land animal, with a long trunk" },
    { answer: "GIRAFFE", clue: "Tallest animal, with a very long neck" },
    { answer: "PENGUIN", clue: "Black-and-white bird that swims but can't fly" },
    { answer: "KANGAROO", clue: "Australian animal that carries its baby in a pouch" },
    { answer: "DOLPHIN", clue: "Smart sea mammal that clicks and whistles" },
    { answer: "CHEETAH", clue: "Fastest animal on land" },
    { answer: "OWL", clue: "Night bird that can turn its head very far" },
    { answer: "ZEBRA", clue: "Horse-like animal with black and white stripes" },
    { answer: "BEAVER", clue: "Animal that builds dams with its teeth" },
    { answer: "OCTOPUS", clue: "Sea animal with eight arms" },
    { answer: "CAMEL", clue: "Desert animal with one or two humps" },
    { answer: "BAT", clue: "The only mammal that can truly fly" },
  ] },
  { slug: "christmas", name: "Christmas", entries: [
    { answer: "SANTA", clue: "He delivers presents on Christmas Eve" },
    { answer: "REINDEER", clue: "Animals that pull the sleigh" },
    { answer: "RUDOLPH", clue: "Reindeer with a red nose" },
    { answer: "STOCKING", clue: "It hangs by the fireplace, filled with treats" },
    { answer: "SNOWMAN", clue: "Built from snow, often with a carrot nose" },
    { answer: "WREATH", clue: "Ring of evergreen branches hung on a door" },
    { answer: "MISTLETOE", clue: "Plant you might kiss under" },
    { answer: "ELVES", clue: "Santa's helpers in the workshop" },
    { answer: "SLEIGH", clue: "Santa's ride through the sky" },
    { answer: "GINGERBREAD", clue: "Cookie used to build little houses" },
    { answer: "ORNAMENT", clue: "Decoration hung on the tree" },
    { answer: "CAROLS", clue: "Holiday songs sung door to door" },
  ] },
  { slug: "thanksgiving", name: "Thanksgiving", entries: [
    { answer: "TURKEY", clue: "Bird served at most Thanksgiving dinners" },
    { answer: "PILGRIMS", clue: "Settlers who sailed to Plymouth in 1620" },
    { answer: "MAYFLOWER", clue: "Ship that carried the Pilgrims to America in 1620" },
    { answer: "CRANBERRY", clue: "Tart red berry made into a sauce" },
    { answer: "STUFFING", clue: "Bread dish often cooked inside the bird" },
    { answer: "PUMPKIN", clue: "Orange squash baked into a popular pie" },
    { answer: "NOVEMBER", clue: "Month of Thanksgiving in the US" },
    { answer: "THURSDAY", clue: "Day of the week Thanksgiving falls on" },
    { answer: "PARADE", clue: "Macy's holds a famous one in New York" },
    { answer: "GRAVY", clue: "Sauce poured over mashed potatoes" },
    { answer: "HARVEST", clue: "Gathering crops in the fall" },
    { answer: "WISHBONE", clue: "Bone two people pull for luck" },
  ] },
  { slug: "halloween", name: "Halloween", entries: [
    { answer: "PUMPKIN", clue: "Carved into a jack-o'-lantern" },
    { answer: "COSTUME", clue: "What you wear to go trick-or-treating" },
    { answer: "GHOST", clue: "Spirit that says \"Boo!\"" },
    { answer: "WITCH", clue: "She flies on a broomstick" },
    { answer: "SKELETON", clue: "All the bones of a body" },
    { answer: "VAMPIRE", clue: "Dracula is one" },
    { answer: "MUMMY", clue: "Wrapped in bandages in an Egyptian tomb" },
    { answer: "CANDY", clue: "Treats collected door to door" },
    { answer: "OCTOBER", clue: "Month when Halloween happens" },
    { answer: "SPIDER", clue: "Eight-legged web spinner" },
    { answer: "CAULDRON", clue: "Big pot for a witch's brew" },
    { answer: "BAT", clue: "Flying animal that sleeps upside down" },
  ] },
  { slug: "science", name: "Science for kids", entries: [
    { answer: "GRAVITY", clue: "Force that pulls things toward Earth" },
    { answer: "PLANET", clue: "Earth is one; so are Mars and Jupiter" },
    { answer: "OXYGEN", clue: "Gas we need to breathe" },
    { answer: "MAGNET", clue: "It attracts iron and steel" },
    { answer: "VOLCANO", clue: "Mountain that can erupt with lava" },
    { answer: "FOSSIL", clue: "Remains of an ancient living thing in rock" },
    { answer: "ENERGY", clue: "The ability to do work; the sun gives us lots" },
    { answer: "CELL", clue: "Smallest unit of life" },
    { answer: "WATER", clue: "H2O" },
    { answer: "SOLAR", clue: "Having to do with the sun, as in ___ system" },
    { answer: "ATOM", clue: "Tiny building block of all matter" },
    { answer: "THERMOMETER", clue: "Tool that measures temperature" },
  ] },
];
export const CLUE_SET_BY_SLUG = Object.fromEntries(CLUE_SETS.map((c) => [c.slug, c])) as Record<string, ClueSet>;

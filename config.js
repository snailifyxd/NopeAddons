import { @Vigilant, @SwitchProperty, @TextProperty, @CheckboxProperty, @ButtonProperty, @SelectorProperty, @SliderProperty, @ColorProperty, @PercentSliderProperty, Color} from "../Vigilance/index";

@Vigilant("NopeAddons")
class Settings {
  @TextProperty({
    name: "Guild Bot Name",
    description: "Enter the IGN of your guild bridge bot",
    category: "Formatting"
  })
  botName = "TheNoobCode" 
  
  @SwitchProperty({
    name: "Welcome guild members",
    category: "Your messages",
  })
  welcomeMessage = false;

  @TextProperty({
    name: "Welcome message",
    category: "Your messages",
    placeholder: "Welcome back"
  })
  welcomeMessageText = 'Welcome back';

  constructor() {
      this.initialize(this);
      /*this.registerListener("text", newText => {
          console.log(`Text changed to ${newText}`);
      });*/
      this.setCategoryDescription("Formatting", "Formats messages sent by the bot")
      //this.setSubcategoryDescription("General", "Category", "Shows off some nifty property examples.")
  }
}

const settings = new Settings();
export default settings;

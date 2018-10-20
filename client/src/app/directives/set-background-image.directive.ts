import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appSetBackgroundImage]'
})
export class SetBackgroundImageDirective {

  @Input('appSetBackgroundImage') image: string;

  constructor(private element: ElementRef) {
  }

  ngOnInit(){
    this.setBackgroundImage(this.image);
  }
  setBackgroundImage(image) {
    let url = '';
    if (image) {
      url = image.replace('\\', '/');
    } else {
      url ='../../assets/img/home-bg.jpg';
    }
    this.element.nativeElement.style.backgroundImage = `url(${url})`;
  }

}

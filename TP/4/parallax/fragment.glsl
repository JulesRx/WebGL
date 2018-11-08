precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D uSampler2;
void main() {     
     if ( ( mod( gl_FragCoord.y, 2.0 ) ) > 1.00 ) {
          gl_FragColor = texture2D( uSampler, vTextureCoord );
        
				} else {

					gl_FragColor = texture2D( uSampler2, vTextureCoord);

				}
 //  vec4 color0 = texture2D(uSampler, vTextureCoord);
 //  vec4 color1 = texture2D(uSampler2, vTextureCoord);
 //  gl_FragColor = color0;
//gl_FragColor = texture2D(uSampler, vTextureCoord);
}
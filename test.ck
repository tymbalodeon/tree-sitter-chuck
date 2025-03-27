// a class
public class Foo
{
    // int
    1 => static int S_INT;
    // float
    2 => static float S_FLOAT;
    // dur
    3::second => static dur S_DUR;
    // time
    now + 4::second => static time S_TIME;
    // vec3
    @(5,6,7) => static vec3 S_VEC3;
    // array
    [8,9,10,11] @=> static int S_INT_ARRAY[];
    // string
    static string S_STRING("12");
    // ugen
    static SinOsc S_SINOSC(440);
}


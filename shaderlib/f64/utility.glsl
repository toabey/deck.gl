//const float EPSILON = 1.2e-7; // precision ~pow(2,-24)

float check_error(vec2 result, vec2 ref, float EPSILON)
{
  float pass = 0.0;

  if (abs((result.x - ref.x) / ref.x) < EPSILON) pass += 2.0;
  if (abs((result.y - ref.y) / ref.y) < EPSILON) pass += 1.0;

  pass = pass / 3.0;
  return pass;

}
#pragma glslify: export(check_error)

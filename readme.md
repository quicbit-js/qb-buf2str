# qb-buf2str

Convert a buffer or array of bytes into an concise string, or
return the value if it is not an array of bytes.  

ASCII buffers (containing all printable ascii characters) are 
converted to ascii strings.  Other byte buffers are converted to
hex.

This function is used by qb-debug to convert byte buffers buffers to useful/readable
output.

# stringify

Converts an object to a JSON string, recursively applying buf2str
on byte buffers.
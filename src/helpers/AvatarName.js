export const AvatarName = (str) => {
    if(str == null)
        return ""
        
    let initials = str.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
}